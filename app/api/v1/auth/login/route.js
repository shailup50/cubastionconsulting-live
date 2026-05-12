import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { UserName, Passwords } = body;
    if (!UserName || !Passwords) {
      return NextResponse.json({ status: false, message: 'Username and password are required' }, { status: 422 });
    }
    const user = await queryOne(
      'SELECT * FROM mst_userdata WHERE UserName = ? AND Passwords = ? AND ActiveStatus = 1',
      [UserName, Passwords]
    );
    if (!user) {
      return NextResponse.json({ status: false, message: 'Invalid credentials' }, { status: 401 });
    }
    await query('UPDATE mst_userdata SET LastLoginDate = NOW() WHERE loginID = ?', [user.loginID]);
    const token = Buffer.from(`${user.loginID}:${Date.now()}:${crypto.randomBytes(24).toString('hex')}`).toString('base64');
    return NextResponse.json({
      status: true,
      message: 'Login successful',
      token,
      user: { loginID: user.loginID, UserName: user.UserName },
    });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Login failed', error: error.message }, { status: 500 });
  }
}
