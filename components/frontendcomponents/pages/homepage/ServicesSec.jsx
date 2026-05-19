"use client";
import Button from "../../atoms/Button";
import { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SwiperButton from "../../atoms/SwiperButton";
import { useGetServiceCategoriesQuery } from "@/store/frontendSlice/frontendAPISlice";

export default function ServicesSec({ data, id, initialServiceCategories = null }) {
  if (!data) return null;

  const [openCol, setOpenCol] = useState("1");
  const [unlockedCols, setUnlockedCols] = useState(["1"]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const { data: clientServiceCategories } = useGetServiceCategoriesQuery(undefined, {
    skip: Boolean(initialServiceCategories),
  });
  const serviceCategoriesData = initialServiceCategories ?? clientServiceCategories;

  // ── 1. Build filter questions ─────────────────────────────────────────────
  const filterDataToUse = useMemo(() => {
    const questions = serviceCategoriesData?.questions || {};
    if (Object.keys(questions).length === 0) return data.filterData || [];

    return Object.entries(questions).map(([quesText, options], idx) => ({
      id: String(idx + 1),
      filterQues: quesText,
      quesTypeData: options.map(opt => ({
        id: String(opt.CategoryID),
        typeQues: opt.CategoryName,
        services: (opt.services || []).filter(
          s => s.ActiveStatus === undefined || Number(s.ActiveStatus) === 1
        ),
      })),
    }));
  }, [serviceCategoriesData, data.filterData]);

  // ── 2. Master pool of all unique active services ──────────────────────────
  const allActiveServices = useMemo(() => {
    const questions = serviceCategoriesData?.questions || {};

    if (Object.keys(questions).length === 0) {
      return (data.serviceData || []).filter(
        s => s.ActiveStatus === undefined || Number(s.ActiveStatus) === 1
      );
    }

    const serviceMap = new Map();
    Object.values(questions)
      .flat()
      .forEach(category => {
        (category.services || []).forEach(service => {
          if (
            !serviceMap.has(service.ServiceID) &&
            (service.ActiveStatus === undefined || Number(service.ActiveStatus) === 1)
          ) {
            serviceMap.set(service.ServiceID, service);
          }
        });
      });

    return Array.from(serviceMap.values());
  }, [serviceCategoriesData, data.serviceData]);

  // ── 3. Custom Highlighted Services Mapping ────────────────────────────────
  const HIGHLIGHTED_MAPPING = {
    "1-8": [1, 4, 5],
    "1-7": [1, 4, 7, 6],
    "1-10": [1, 4, 8, 9],
    "1-9": [1, 8, 6],

    "2-8": [6, 4, 5],
    "2-7": [6, 4, 7, 10],
    "2-10": [6, 9, 8, 7],
    "2-9": [6, 8, 7],

    "6-8": [5, 10, 7],
    "6-7": [10, 5, 7, 4],
    "6-10": [10, 5, 8, 9],
    "6-9": [10, 8, 7],

    "3-8": [9, 4, 7],
    "3-7": [9, 4, 7, 10],
    "3-10": [9, 4, 11],
    "3-9": [9, 8, 7, 11],

    "4-8": [8, 7, 4],
    "4-7": [8, 7, 4, 10],
    "4-10": [8, 7, 9, 5],
    "4-9": [8, 7, 11, 4],

    "5-8": [11, 7, 5],
    "5-7": [11, 7, 9, 10],
    "5-10": [11, 9, 8, 7],
    "5-9": [11, 8, 7],
  };

  // ── 4. Get highlighted IDs — null means no filter active yet ─────────────
  const getHighlightedServiceIds = () => {
    const selectedEntries = Object.entries(selectedAnswers);
    if (selectedEntries.length < 2) return null;

    const q1Id = selectedAnswers["1"];
    const q2Id = selectedAnswers["2"];
    const mappingKey = `${q1Id}-${q2Id}`;
    const highlightedIds = HIGHLIGHTED_MAPPING[mappingKey];

    if (highlightedIds) return highlightedIds.map(Number);

    // Fallback: intersection logic
    return allActiveServices
      .filter(service => {
        const sid = String(service.ServiceID);
        return selectedEntries.every(([quesId, catId]) => {
          const question = filterDataToUse.find(q => q.id === quesId);
          const category = question?.quesTypeData.find(c => c.id === String(catId));
          return category?.services?.some(s => String(s.ServiceID) === sid);
        });
      })
      .map(s => Number(s.ServiceID));
  };

  // ── 5. Shape for rendering — ALL services always, highlighted ones to top ──
  const highlightedIds = getHighlightedServiceIds(); // null or number[]
  const isFilterActive = highlightedIds !== null;

  const allMapped = [
    ...new Map(
      allActiveServices
        .map(item => {
          const sId = item.ServiceID || item.id;
          if (!sId) return null;
          const staticMatch = data.serviceData?.find(
            s => String(s.id) === String(sId)
          );
          return [
            sId,
            {
              id: sId,
 DisplayOrder: item.DisplayOrder,
              title:
                item.ServiceName ||
                item.serviceName ||
                staticMatch?.serviceName ||
                "Loading...",
              img: item.ServiceImage || staticMatch?.img,
              bgpattern:
                item.bgpattern ||
                staticMatch?.bgpattern ||
                "/assets/vector/service_bg1.svg",
              link: item.ServiceNameURL
                ? `/${item.ServiceNameURL}`
                : item.link || staticMatch?.link || "#",
              // active only when BOTH questions answered AND this service is matched
              isHighlighted: isFilterActive && highlightedIds.includes(Number(sId)),
            },
          ];
        })
        .filter(Boolean)
    ).values(),
  ];

  // highlighted services float to top, rest follow
const uniqueDisplayServices = isFilterActive
  ? [...allMapped].sort((a, b) => {
      if (b.isHighlighted !== a.isHighlighted) {
        return b.isHighlighted - a.isHighlighted;
      }
      return a.DisplayOrder - b.DisplayOrder;
    })
  : [...allMapped].sort((a, b) => a.DisplayOrder - b.DisplayOrder);


  // ── 6. Handlers ───────────────────────────────────────────────────────────
  const handleRadioChange = (filterQuesId, typeId, nextFilterId) => {
    setSelectedAnswers(prev => ({ ...prev, [filterQuesId]: typeId }));
    if (nextFilterId) {
      setUnlockedCols(prev =>
        prev.includes(nextFilterId) ? prev : [...prev, nextFilterId]
      );
      setOpenCol(nextFilterId);
    }
  };

  const handleColClick = colId => {
    if (!unlockedCols.includes(colId)) return;
    setOpenCol(prev => (prev === colId ? null : colId));
  };

  // ── 7. Service card renderer ──────────────────────────────────────────────
  const renderServiceCol = (service, index) => (
    <div
      className={`service_col ${service.isHighlighted ? "active" : ""}`}
      key={service.id || index}
    >
      <div className="bg_pattern">
        <img src={service.bgpattern} alt="" />
      </div>
      <figcaption>
        <h6>{service.title}</h6>
        {service.img && (
          <img
            className="vector_img"
            src={`/uploads/onlineImages/ServiceImages/${service.img}`}
            alt={service.title}
          />
        )}
        {/* <Button
          classname="white-border medium"
          linkHref={service.link || "/services"}
          buttonText="View Service"
        /> */}
      </figcaption>
    </div>
  );

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 769);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // ── 8. JSX ────────────────────────────────────────────────────────────────
  return (
    <section>
      <div className="services_sec sec-pad-all" id={id}>
        <div className="container">
          <div className="heading">
            <h2>{data.heading}</h2>
            <p>{data.subheading}</p>
          </div>

          <div className="service_wrapper">
            <div className="filter_wrapper">
              {filterDataToUse.map((ques, index) => {
                const isUnlocked = unlockedCols.includes(ques.id);
                const isOpen = openCol === ques.id;
                const nextFilter = filterDataToUse[index + 1];
                return (
                  <div
                    className={`filter_col ${isOpen ? "active" : ""} ${!isUnlocked ? "disabled" : ""
                      }`}
                    key={ques.id}
                  >
                    <div
                      className="filter_title"
                      onClick={() => handleColClick(ques.id)}
                    >
                      <p className="count">{index + 1}.</p>
                      <h6>{ques.filterQues}</h6>
                      <div className="plus"></div>
                    </div>
                    <div className="filter_dropdown">
                      <div className="filter_type_wrap">
                        {ques.quesTypeData.map(type => {
                          const isSelected = selectedAnswers[ques.id] === type.id;
                          return (
                            <div
                              className={`ques_type_col ${isSelected ? "active" : ""}`}
                              key={type.id}
                            >
                              <label htmlFor={`type_radio_${ques.id}_${type.id}`}>
                                {type.typeQues}
                              </label>
                              <input
                                type="radio"
                                name={`type_radio_${ques.id}`}
                                id={`type_radio_${ques.id}_${type.id}`}
                                checked={isSelected}
                                onChange={() =>
                                  handleRadioChange(ques.id, type.id, nextFilter?.id)
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="filter_service_wrap">
              {isMobile ? (
                <>
                  <Swiper
                    className="service_filter_slider"
                    modules={[Navigation]}
                    speed={1000}
                    navigation={{ prevEl: ".filter-prev", nextEl: ".filter-next" }}
                    breakpoints={{
                      0: { slidesPerView: 1.5, spaceBetween: 10 },
                      500: { slidesPerView: 2.2, spaceBetween: 15 },
                    }}
                  >
                    {uniqueDisplayServices.map((item, index) => (
                      <SwiperSlide key={item.id || index}>
                        {renderServiceCol(item, index)}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="swiper-nav white group">
                    <SwiperButton classname="swiper-prev filter-prev" />
                    <SwiperButton classname="swiper-next filter-next" />
                  </div>
                </>
              ) : (
                <>
                  {uniqueDisplayServices.map((item, index) =>
                    renderServiceCol(item, index)
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}