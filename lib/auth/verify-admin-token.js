import { queryOne } from "@/lib/db";

/**
 * Validates the admin Bearer token issued by POST /api/v1/auth/login.
 * @param {string | null | undefined} authHeader
 */
export async function verifyAdminToken(authHeader) {
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

    const user = await queryOne(
      "SELECT loginID, UserName FROM mst_userdata WHERE loginID = ? AND ActiveStatus = 1",
      [loginID],
    );

    return user || null;
  } catch {
    return null;
  }
}
