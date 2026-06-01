import { queryOne } from "@/lib/db";
import type { User } from "@/types/entities";

type AdminUser = Pick<User, "loginID" | "UserName">;

export async function verifyAdminToken(authHeader: string | null | undefined): Promise<AdminUser | null> {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return null;
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [loginID] = decoded.split(":");
    if (!loginID) {
      return null;
    }

    const user = await queryOne<AdminUser>(
      "SELECT loginID, UserName FROM mst_userdata WHERE loginID = ? AND ActiveStatus = 1",
      [loginID],
    );

    return user || null;
  } catch {
    return null;
  }
}
