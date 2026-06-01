"use client";
import Image from "next/image";
import Link from "next/link"
import { useState, useEffect } from "react";
import Select from "../../atoms/Select";
import CaseResultCol from "../../molecules/CaseResultCol";

interface CaseResultsProps {
  data: any;
  id: string;
}

export default function CaseResults({ data, id }: CaseResultsProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const industriesList = [
    ...new Set(data?.slice(6).map((item: any) => item.industry?.IndustryName)),
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (!data) return;
    let filtered = data?.slice(6);

    if (selectedIndustries.length > 0) {
      filtered = filtered?.filter((item: any) =>
        selectedIndustries.includes(item.industry?.IndustryName)
      );
    }

    if (search) {
      filtered = filtered?.filter((item: any) =>
        item.PortfolioName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(filtered || []);
  }, [selectedIndustries, search, data]);

  if (!data) return null;

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && value !== "0" && !selectedIndustries.includes(value)) {
      setSelectedIndustries((prev) => [...prev, value]);
    }
  };

  const removeIndustry = (industryToRemove: string) => {
    setSelectedIndustries((prev) => prev.filter((item) => item !== industryToRemove));
  };

  const clearAll = () => {
    setSelectedIndustries([]);
  };

  return (
    <div className="case_results_sec" id={id}>
      <div className="container">
        <nav>
          <div className="results_nav">
            <h6 className="results_found">
              {filteredData?.length} results found
            </h6>
            <div className="filter_wrap">
              <div className="search_wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#0000004D"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"
                  ></path>
                </svg>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search Case Studies"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select
                classname="industries_filter"
                label="Industries Filter"
                name="industries"
                id="industries"
                value="0"
                onChange={handleIndustryChange}
                options={industriesList?.map((item) => {
                  return { value: item, label: item };
                })}
              />
            </div>
          </div>
          {selectedIndustries.length > 0 && (
            <div className="selected_wrapper">
              {selectedIndustries.map((item, index) => (
                <div className="selected_case" key={index}>
                  {item}
                  <div className="close" onClick={() => removeIndustry(item)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="#666666"
                        strokeLinecap="round"
                        d="m6 6l12 12m0-12L6 18"
                        strokeWidth={1}
                      ></path>
                    </svg>
                  </div>
                </div>
              ))}
              <button type="button" className="clearAll" onClick={clearAll}>
                Clear All
              </button>
            </div>
          )}
        </nav>
        <div className="case_results_wrapper">
          {filteredData?.length > 0 ? (
            filteredData?.map(
              (
                { PortfolioType, PortfolioName, author, PortfolioImage, PortfolioNameURL, industry }: any,
                index: number,
              ) => (
                <CaseResultCol
                  key={index}
                  bgmedia={`/uploads/onlineImages/PortfolioImages/${PortfolioImage}`}
                  heading={PortfolioName}
                  caseProfilepic={`/uploads/onlineImages/AuthorImages/${author?.AuthorImage}`}
                  caseProfileName={author?.AuthorName}
                  caseProfileDesgn={author?.AuthorTaglin}
                  tag={PortfolioType}
                  PortfolioNameURL={PortfolioNameURL}
                  industry={industry?.IndustryName}
                />
              ),
            )
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
