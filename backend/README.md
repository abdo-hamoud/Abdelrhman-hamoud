# تشغيل تسجيل الدخول بالإيميل — غير مفعّل حتى نشر الخادم
الواجهة التجريبية: `admin/email-login.html`. لوحة `admin/index.html` الحالية لم يتم استبدالها، حتى لا تتوقف وسيلة الإدارة السابقة.
1. افتح مشروع Cloudflare Workers، واربط مجلد backend أو استخدم Wrangler من الجهاز (حساب Cloudflare مطلوب).
2. شغّل `node backend/generate-password.mjs` محليًا. سيولّد كلمة مرور قوية وأربعة أسرار. لا ترفع القيم إلى GitHub ولا ترسلها في المحادثة.
3. أنشئ مفتاح GitHub fine-grained خاص بمستودع البورتفوليو، بصلاحية Contents: Read and write فقط ومدة مناسبة.
4. اضبط أسرار Worker: ADMIN_EMAIL (بريدك)، ADMIN_PASSWORD_HASH، ADMIN_PASSWORD_SALT، PASSWORD_PEPPER، SESSION_SECRET، GITHUB_TOKEN. استخدم Wrangler secrets file محليًا خارج المستودع أو لوحة Cloudflare. لا تضعها في ملف عام.
5. انشر backend باستخدام Wrangler. تحقق من rate limit binding ومن حدود CPU قبل النشر الفعلي؛ قد يتطلب حسابًا مدفوعًا. 
6. أضف `admin/worker-config.json` إلى GitHub وفيه فقط {"url":"https://portfolio-admin.YOUR-SUBDOMAIN.workers.dev"} باستخدام الرابط الحقيقي. 
7. اختبر تسجيل الدخول الصحيح والخاطئ والنشر، ثم استبدل admin/index.html بمحتوى admin/email-login.html. الموقع العام لا يتغير.
لم يُنشر الخادم بعد، ولم يتم اختبار النشر أو تسجيل الدخول فعليًا. كلمة المرور السابقة المقترحة في المحادثة غير مناسبة للاستخدام.
