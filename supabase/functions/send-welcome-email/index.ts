
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
        <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; text-align: right; color: #082f49; max-width: 600px; margin: 0 auto; padding: 30px 20px; background-color: #ffffff; border-radius: 10px; border: 2px solid #0369a1;">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="https://cdn-icons-png.flaticon.com/512/5111/5111463.png" alt="One Piece Logo" style="width: 120px; margin: 0 auto; display: block;" />
            <h1 style="color: #0369a1; font-size: 28px; margin: 20px 0 10px; font-weight: bold;">مرحباً بك في مغامرة ون بيس!</h1>
            <div style="height: 4px; width: 80px; background: linear-gradient(90deg, #0369a1, #38bdf8); margin: 0 auto 20px;"></div>
          </div>
          
          <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px; color: #334155;">عزيزي <span style="font-weight: bold; color: #0369a1;">${username}</span>،</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 18px; color: #334155;">يسعدنا انضمامك إلى مجتمعنا! نحن متحمسون لبدء رحلتك في عالم ون بيس الرائع.</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-right: 4px solid #0369a1; margin: 25px 0;">
            <p style="font-size: 16px; font-weight: bold; color: #0369a1; margin: 0 0 15px;">يمكنك الآن الاستمتاع بكل هذه المميزات:</p>
            <ul style="font-size: 16px; line-height: 1.8; margin: 0; padding-right: 20px; color: #334155;">
              <li>خوض اختبارات متنوعة حول عالم ون بيس</li>
              <li>مشاركة النتائج مع أصدقائك</li>
              <li>متابعة أحدث أخبار المانجا</li>
              <li>التنافس مع لاعبين آخرين</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://onepiece-quiz-adventure.vercel.app" style="background-color: #0369a1; color: white; text-decoration: none; font-weight: bold; font-size: 18px; padding: 12px 25px; border-radius: 30px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.3s;">ابدأ المغامرة الآن</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #334155;">نتطلع لمشاركتك النشطة في عالمنا. إذا كان لديك أي استفسارات، فلا تتردد في التواصل معنا.</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 8px; color: #334155;">مع أطيب التحيات،</p>
          <p style="font-size: 16px; line-height: 1.6; font-weight: bold; margin-bottom: 30px; color: #0369a1;">فريق مغامرة ون بيس</p>
          
          <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 13px; color: #64748b;">
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} مغامرة اختبار ون بيس - جميع الحقوق محفوظة</p>
            <p style="margin: 5px 0;">هذه رسالة ترحيبية تلقائية، لا داعي للرد عليها</p>
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
