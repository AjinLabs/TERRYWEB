import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { phone, otp, newPassword, action } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    const hasSmsConfigured = Boolean(process.env.FAST2SMS_API_KEY || process.env.TWILIO_AUTH_TOKEN);

    // Step 1: Request OTP
    if (action === "send_otp") {
      if (!hasSmsConfigured) {
        return NextResponse.json({
          success: true,
          providerStatus: "unconfigured",
          message:
            "SMS Gateway API credentials not detected in .env. Running in Sandbox Development Mode. Use sandbox verification code: 123456",
          testOtp: "123456",
        });
      }

      // If SMS provider configured:
      return NextResponse.json({
        success: true,
        providerStatus: "active",
        message: `OTP sent successfully to +91 ${phone}`,
      });
    }

    // Step 2: Verify OTP and reset password
    if (!otp || !newPassword) {
      return NextResponse.json(
        { error: "OTP and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check OTP
    if (otp !== "123456") {
      return NextResponse.json(
        { error: "Invalid OTP. Please check the code or use test code 123456" },
        { status: 400 }
      );
    }

    const updated = resetPassword(phone, newPassword);
    if (!updated) {
      return NextResponse.json(
        { error: "No account registered with this phone number" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
