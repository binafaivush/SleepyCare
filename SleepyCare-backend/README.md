
# 💤 SleepyCare – אפליקציה לניהול תהליכי ייעוץ שינה להורים

## 📌 תיאור כללי

 היא אפליקציה שנועדה להקל על תהליכי ליווי שינה עבור יועצות שינה והורים לתינוקות וילדים.
האפליקציה מספקת כלים פשוטים ונגישים לניהול יומני שינה, תקשורת, תזכורות, תכנים מקצועיים, תיאום פגישות וחשבוניות.

מטרת האפליקציה היא לאפשר ליועצות שינה ללוות לקוחות בצורה מסודרת, אוטומטית ויעילה, ולאפשר להורים למלא נתונים גם כאשר הם טרודים או עסוקים – אפילו באמצעות דיבור ותמלול אוטומטי. עיצוב האפליקציה רך, פשוט ונעים כדי לתמוך באווירה רגועה של שינה ונוחות.

---

## 🎯 קהל יעד

- **יועצות שינה** – משתמשות מנהלות שמלוות לקוחות, עם גישה מלאה למערכת.
- **הורים** – משתמשים רגילים שממלאים יומנים, מקבלים תכנים ותזכורות.

---

## 🧩 פיצ'רים עיקריים

### 👩‍⚕️ ליועצת שינה:

- ניהול לקוחות (הוספה, צפייה, עדכון, מחיקה)
- צפייה ומעקב אחר יומני שינה
- שליחת תזכורות מותאמות אישית לכל הורה
- העלאת תכנים מקצועיים (מאמרים, סרטונים, קישורים)
- לוח שנה לניהול הפגישות (כולל יצירת לינק Zoom)
- הוצאת חשבוניות וחיבור לתשלום חיצוני
- ניתוח חכם של נתוני שינה (למשל ממוצע שעות שינה, תדירות יקיצות)

### 👨‍👩‍👧 להורה:

- מילוי יומן שינה יומי לפי טופס פשוט ומוגדר
- אפשרות להקליט דיבור -> המרה אוטומטית לתמלול -> מיפוי לשדות ביומן
- קבלת תזכורות מותאמות ("זמן השינה מתקרב" וכו’)
- צפייה בתכנים שנשלחו מהיועצת
- תיאום פגישות ישירות עם היועצת דרך האפליקציה

---

## 🖥️ API Backend – פעולות שרת

### 🔐 אימות והרשאות

- `POST /auth/register` – הרשמה
- `POST /auth/login` – התחברות
- `GET /auth/me` – קבלת פרטי המשתמש המחובר

### 👥 ניהול משתמשים ולקוחות

- `GET /clients` – קבלת רשימת לקוחות
- `POST /clients` – יצירת לקוח חדש
- `PUT /clients/{id}` – עדכון פרטי לקוח
- `DELETE /clients/{id}` – מחיקת לקוח

### 💤 יומני שינה

- `GET /sleep-journal` – קבלת יומנים
- `POST /sleep-journal` – הוספת רשומה
- `PUT /sleep-journal/{id}` – עדכון רשומה
- `DELETE /sleep-journal/{id}` – מחיקה

### ⏰ תזכורות

- `POST /reminders` – יצירת תזכורת
- `GET /reminders` – צפייה בתזכורות קיימות
- `PUT /reminders/{id}` – עדכון
- `DELETE /reminders/{id}` – מחיקה
- נדרש מנגנון Scheduler לשליחה אוטומטית בזמן אמת

### 📚 תכנים והדרכות

- `POST /resources` – הוספת תוכן
- `GET /resources` – רשימת תכנים
- `DELETE /resources/{id}` – מחיקה

### 📆 פגישות ולוח שנה

- `GET /calendar` – צפייה בלוח
- `POST /appointments` – קביעת פגישה
- `PUT /appointments/{id}` – עדכון
- `DELETE /appointments/{id}` – מחיקה
- שילוב עם Zoom API ליצירת לינקים אוטומטית

### 💳 חשבוניות ותשלומים

- `POST /invoices` – יצירת חשבונית
- `GET /invoices` – צפייה בחשבוניות
- `POST /payment-link` – יצירת לינק לתשלום

### 📊 ניתוח וסטטיסטיקות

- `GET /analytics/client/{id}` – ממוצעים, תובנות, סיכומים אוטומטיים

---

## 🧱 מבנה מסד נתונים (ERD)

### Users

- id (PK)
- full_name
- email
- password_hash
- role (admin / parent)
- phone_number
- created_at

### Clients

- id (PK)
- user_id (FK -> Users)
- counselor_id (FK -> Users)
- child_name
- child_birthdate
- notes

### SleepJournals

- id (PK)
- client_id (FK)
- date
- bed_time
- wake_time
- nap_times
- wake_ups_count
- mood
- notes
- submitted_by_voice (boolean)

### Reminders

- id (PK)
- client_id (FK)
- title
- message
- scheduled_time
- sent (boolean)

### Resources

- id (PK)
- title
- description
- type (article / video / link)
- url
- uploaded_by (FK)
- visible_to_clients

### Appointments

- id (PK)
- client_id (FK)
- counselor_id (FK)
- start_time
- end_time
- zoom_link
- status

### Invoices

- id (PK)
- client_id (FK)
- amount
- description
- payment_link
- status

### AnalyticsSummaries

- id (PK)
- client_id (FK)
- start_date
- end_date
- avg_sleep_hours
- avg_nap_count
- summary_text

---

## 🎨 עיצוב וחוויית משתמש

- צבעים רכים ונעימים (תכלת, בז’, ורוד בהיר)
- עיצוב פשוט וקריא, במיוחד להורים עייפים
- ניווט קל עם טאבים ברורים
- אפשרות להקלטה קולית והמרה לטופס ביומן
- UX שמותאם לשימוש מהיר בזמן טיפול בילדים

---

## 🛠 טכנולוגיות מוצעות

- Backend: Node.js
- DB: MongoDB
- Frontend: React Native
- Push Notifications: Firebase
- Voice-to-Text: Google Speech-to-Text / Whisper API
- תשלומים: Stripe / חשבונית ירוקה / PayBox / Bit
- זום: Zoom API

---

## 🔐 אבטחה

- הצפנת מידע רגיש (יומני שינה, פרטי לקוח)
- הרשאות לפי תפקיד משתמש
- תמיכה ב-GDPR – כולל אפשרות למחיקת חשבון ונתונים לפי דרישה

---

## 📌 שלב ראשון – MVP

האפליקציה בשלב ראשון תפותח כ-MVP: יכלול את הליבה – יומנים, לקוחות, תכנים, תזכורות, חשבוניות ולוח שנה.
פיצ'רים מתקדמים (כגון צ'אט, פורום הורים) יתווספו בשלבים הבאים.
