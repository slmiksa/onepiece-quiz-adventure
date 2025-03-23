
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  username: string;
}

export const handler = async (req: Request): Promise<Response> => {
  // التعامل مع طلبات الـ CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, username }: WelcomeEmailRequest = await req.json();

    if (!email || !username) {
      return new Response(
        JSON.stringify({
          error: "البريد الإلكتروني واسم المستخدم مطلوبين",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`إرسال بريد ترحيبي إلى: ${email} (${username})`);

    const emailResponse = await resend.emails.send({
      from: "One Piece Quiz Adventure <onboarding@resend.dev>",
      to: [email],
      subject: "أهلاً بك في مغامرة اختبار ون بيس!",
      html: `
        <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; text-align: right; color: #082f49; max-width: A600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff; border-radius: 10px;">
          <img src="https://cdn-icons-png.flaticon.com/512/5111/5111463.png" alt="One Piece Logo" style="width: 100px; margin: 0 auto 20px; display: block;" />
          <h1 style="color: #0369a1; text-align: center; font-size: 24px; margin-bottom: 20px;">مرحباً بك في مغامرة اختبار ون بيس!</h1>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">عزيزي ${username}،</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">شكراً لانضمامك إلى مجتمعنا! نحن متحمسون لمشاركتك في مغامرة ون بيس معنا.</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">يمكنك الآن الاستمتاع بجميع ميزات الموقع:</p>
          <ul style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; padding-right: 20px;">
            <li>خوض اختبارات متنوعة حول عالم ون بيس</li>
            <li>مشاركة النتائج مع أصدقائك</li>
            <li>متابعة أحدث أخبار المانجا</li>
            <li>التنافس مع لاعبين آخرين</li>
          </ul>
          <div style="background-color: #0369a1; color: white; text-align: center; padding: 15px; border-radius: 5px; margin: 30px 0;">
            <a href="https://onepiece-quiz-adventure.vercel.app" style="color: white; text-decoration: none; font-weight: bold; font-size: 18px;">ابدأ المغامرة الآن</a>
          </div>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">إذا كان لديك أي استفسارات، فلا تتردد في التواصل معنا.</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 5px;">مع أطيب التحيات،</p>
          <p style="font-size: 16px; line-height: 1.6; font-weight: bold; margin-bottom: 15px;">فريق مغامرة اختبار ون بيس</p>
          <div style="border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 12px; color: #64748b; text-align: center;">
            <p>© ${new Date().getFullYear()} مغامرة اختبار ون بيس. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      `,
    });

    console.log("تم إرسال البريد بنجاح:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("خطأ في إرسال البريد الإلكتروني:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// بدء الخدمة
serve(handler);
