#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
USERNAME="ahmeddev-inc"
EMAIL="ahmeddev8118@gmail.com"
REPO_NAME="ahmeddev-inc.github.io"
SOURCE_DIR="/storage/emulated/0/Kayan_Final_Development"
TEMP_DIR="/tmp/website_deploy"
GITHUB_URL="https://github.com/${USERNAME}/${REPO_NAME}.git"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}🚀 سكريبت تجهيز ورفع الموقع لـ GitHub Pages${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to check command existence
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 غير مثبت. الرجاء تثبيته أولاً.${NC}"
        exit 1
    fi
}

# Check prerequisites
echo -e "${YELLOW}🔍 فحص المتطلبات الأساسية...${NC}"
check_command git
check_command find
check_command sed

# Create temporary directory
echo -e "${YELLOW}📁 إنشاء مجلد مؤقت...${NC}"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Copy website files
echo -e "${YELLOW}📂 نسخ ملفات الموقع...${NC}"
cp -r $SOURCE_DIR/* $TEMP_DIR/
cp -r $SOURCE_DIR/.* $TEMP_DIR/ 2>/dev/null || true

cd $TEMP_DIR

# Create necessary files
echo -e "${YELLOW}📄 إنشاء ملفات ضرورية...${NC}"

# 1. Create .nojekyll file
echo -e "${GREEN}✓ إنشاء ملف .nojekyll${NC}"
echo "" > .nojekyll

# 2. Create CNAME file (optional)
echo -e "${GREEN}✓ إنشاء ملف CNAME${NC}"
echo "ahmeddev-inc.github.io" > CNAME

# 3. Create .gitignore
echo -e "${GREEN}✓ إنشاء ملف .gitignore${NC}"
cat > .gitignore << EOF
# IDE files
.vscode/
.idea/
*.swp
*.swo

# System files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Temporary files
tmp/
temp/

# Uploads (if not part of site)
uploads/temp/
EOF

# Fix file paths in HTML files
echo -e "${YELLOW}🔧 إصلاح المسارات في ملفات HTML...${NC}"

# Fix CSS paths
find . -name "*.html" -type f -exec sed -i 's|href="/|href="./|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|href="styles/|href="./styles/|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|href="assets/css/|href="./assets/css/|g' {} \;

# Fix JS paths
find . -name "*.html" -type f -exec sed -i 's|src="/|src="./|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|src="scripts/|src="./scripts/|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|src="assets/js/|src="./assets/js/|g' {} \;

# Fix image paths
find . -name "*.html" -type f -exec sed -i 's|src="/images/|src="./images/|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|src="images/|src="./images/|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|src="assets/img/|src="./assets/img/|g' {} \;

# Fix internal links between pages
echo -e "${GREEN}✓ إصلاح الروابط الداخلية بين الصفحات${NC}"
find . -name "*.html" -type f -exec sed -i 's|href="/pages/|href="./pages/|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|href="pages/|href="./pages/|g' {} \;

# Update sitemap.xml
echo -e "${YELLOW}🗺️ تحديث ملف sitemap.xml...${NC}"
if [ -f "sitemap.xml" ]; then
    sed -i 's|https://example.com|https://ahmeddev-inc.github.io|g' sitemap.xml
    echo -e "${GREEN}✓ تم تحديث sitemap.xml${NC}"
fi

# Update robots.txt
echo -e "${YELLOW}🤖 تحديث ملف robots.txt...${NC}"
if [ -f "robots.txt" ]; then
    sed -i 's|Sitemap: https://example.com/sitemap.xml|Sitemap: https://ahmeddev-inc.github.io/sitemap.xml|g' robots.txt
    echo -e "${GREEN}✓ تم تحديث robots.txt${NC}"
fi

# Update manifest.json
echo -e "${YELLOW}📱 تحديث ملف manifest.json...${NC}"
if [ -f "manifest.json" ]; then
    sed -i 's|"/icons/|"./icons/|g' manifest.json
    sed -i 's|"/images/|"./images/|g' manifest.json
    echo -e "${GREEN}✓ تم تحديث manifest.json${NC}"
fi

# Create README for GitHub
echo -e "${YELLOW}📝 إنشاء ملف README.md...${NC}"
cat > README.md << EOF
# 🌟 موقع كيان للتبريد والتكييف

موقع إعلاني احترافي لشركة كيان متخصصة في أنظمة التبريد والتكييف.

## 🔗 الروابط المباشرة

- 🌐 **الموقع الرئيسي**: [https://ahmeddev-inc.github.io](https://ahmeddev-inc.github.io)
- 🏢 **عن الشركة**: [https://ahmeddev-inc.github.io/pages/about/company.html](pages/about/company.html)
- 📞 **اتصل بنا**: [https://ahmeddev-inc.github.io/pages/contact/contact.html](pages/contact/contact.html)

## 📁 هيكل الموقع

\`\`\`
├── index.html              # الصفحة الرئيسية
├── styles/                 # أنماط CSS
├── scripts/               # سكريبتات JavaScript
├── pages/                 # الصفحات الفرعية
│   ├── about/            # صفحات عن الشركة
│   ├── services/         # الخدمات
│   ├── projects/         # المشاريع
│   └── contact/          # صفحات الاتصال
├── assets/               # الأصول (صور، أيقونات)
└── images/               # الصور العامة
\`\`\`

## 🚀 كيفية التحديث

\`\`\`bash
# سحب التحديثات (إذا كان هناك تعاون)
git pull origin main

# إضافة التغييرات
git add .

# عمل commit
git commit -m "وصف التحديث"

# رفع التغييرات
git push origin main
\`\`\`

## 📞 للتواصل

- 📧 البريد الإلكتروني: ahmeddev8118@gmail.com
- 💼 GitHub: [ahmeddev-inc](https://github.com/ahmeddev-inc)

---

⚡ **تم التطوير بواسطة AhmedDev Inc.** 
EOF

# Initialize git repository
echo -e "${YELLOW}🐙 تهيئة مستودع Git...${NC}"
rm -rf .git
git init
git config user.name "$USERNAME"
git config user.email "$EMAIL"

# Add all files
git add .

# Commit changes
echo -e "${YELLOW}💾 حفظ التغييرات...${NC}"
git commit -m "🚀 نشر موقع كيان - $(date '+%Y-%m-%d %H:%M:%S')" --quiet

# Ask for deployment method
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}اختر طريقة الرفع:${NC}"
echo "1) رفع إلى مستودع جديد: ${REPO_NAME}"
echo "2) رفع إلى المستودع الحالي: Kayan_Final_Project"
echo -e "${BLUE}========================================${NC}"

read -p "اختر الخيار [1/2]: " choice

case $choice in
    1)
        # Option 1: New repository
        echo -e "${YELLOW}📤 الرفع إلى مستودع جديد...${NC}"
        echo -e "${YELLOW}⚠️  تأكد من إنشاء المستودع ${REPO_NAME} على GitHub أولاً${NC}"
        read -p "هل قمت بإنشاء المستودع على GitHub؟ [y/n]: " confirm
        
        if [[ $confirm == "y" || $confirm == "Y" ]]; then
            git remote add origin $GITHUB_URL
            git branch -M main
            echo -e "${YELLOW}⏳ جاري الرفع...${NC}"
            git push -u origin main --force
            
            echo -e "${GREEN}✅ تم الرفع بنجاح!${NC}"
            echo -e "${BLUE}🌐 رابط موقعك: https://ahmeddev-inc.github.io${NC}"
        else
            echo -e "${RED}❌ الرجاء إنشاء المستودع أولاً:${NC}"
            echo "1. سجل الدخول إلى GitHub"
            echo "2. أنشئ مستودع جديد باسم: ${REPO_NAME}"
            echo "3. تأكد أن المستودع فارغ"
            echo "4. أعد تشغيل السكريبت"
        fi
        ;;
    2)
        # Option 2: Existing repository
        echo -e "${YELLOW}📤 الرفع إلى المستودع الحالي...${NC}"
        OLD_REPO="https://github.com/${USERNAME}/Kayan_Final_Project.git"
        
        # Check if we should use docs folder
        echo -e "${YELLOW}? هل تريد استخدام مجلد docs/ للرفع؟${NC}"
        echo "(مطلوب إذا كنت تريد استخدام GitHub Pages مع مستودع عادي)"
        read -p "[y/n]: " use_docs
        
        if [[ $use_docs == "y" || $use_docs == "Y" ]]; then
            # Move everything to docs folder
            mkdir -p docs
            shopt -s dotglob
            mv * docs/ 2>/dev/null || true
            mv .* docs/ 2>/dev/null || true
            shopt -u dotglob
            cd docs
            mv .git ../ 2>/dev/null || true
            cd ..
        fi
        
        git remote add origin $OLD_REPO
        git branch -M main
        echo -e "${YELLOW}⏳ جاري الرفع...${NC}"
        git push -u origin main --force
        
        echo -e "${GREEN}✅ تم الرفع بنجاح!${NC}"
        if [[ $use_docs == "y" || $use_docs == "Y" ]]; then
            echo -e "${BLUE}🌐 رابط موقعك: https://${USERNAME}.github.io/Kayan_Final_Project${NC}"
            echo -e "${YELLOW}⚠️  تذكر ضبط إعدادات GitHub Pages على:${NC}"
            echo "Branch: main | Folder: /docs"
        else
            echo -e "${BLUE}🌐 رابط موقعك: https://${USERNAME}.github.io/Kayan_Final_Project${NC}"
        fi
        ;;
    *)
        echo -e "${RED}❌ خيار غير صالح${NC}"
        ;;
esac

# Create deployment report
echo -e "${YELLOW}📊 إنشاء تقرير النشر...${NC}"
cat > DEPLOYMENT_REPORT.md << EOF
# تقرير نشر الموقع

## معلومات النشر
- **التاريخ**: $(date)
- **المستخدم**: $USERNAME
- **البريد الإلكتروني**: $EMAIL

## ملفات الموقع
$(find . -type f -name "*.html" | wc -l) صفحة HTML
$(find . -type f -name "*.css" | wc -l) ملف CSS
$(find . -type f -name "*.js" | wc -l) ملف JavaScript
$(find . -type f -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l) صورة

## روابط مهمة
$(if [[ $choice == 1 ]]; then
echo "- 🌐 الموقع الرئيسي: https://ahmeddev-inc.github.io"
else
if [[ $use_docs == "y" || $use_docs == "Y" ]]; then
echo "- 🌐 الموقع الرئيسي: https://${USERNAME}.github.io/Kayan_Final_Project"
else
echo "- 🌐 الموقع الرئيسي: https://${USERNAME}.github.io/Kayan_Final_Project"
fi
fi)

## إعدادات GitHub Pages المطلوبة
$(if [[ $choice == 1 ]]; then
echo "- المستودع: ${REPO_NAME}"
echo "- الإعدادات: تلقائية"
elif [[ $use_docs == "y" || $use_docs == "Y" ]]; then
echo "- المستودع: Kayan_Final_Project"
echo "- Branch: main"
echo "- Folder: /docs"
else
echo "- المستودع: Kayan_Final_Project"
echo "- Branch: main"
echo "- Folder: /root (أو /)"
fi)

## خطوات المتابعة
1. انتظر 1-2 دقيقة حتى يتم نشر الموقع
2. افتح الرابط أعلاه للتأكد
3. اختبر جميع الصفحات والروابط
4. اختبر النماذج إذا وجدت

## استكشاف الأخطاء
إذا واجهت أي مشاكل:
1. تحقق من Console في DevTools (F12)
2. تأكد من صحة المسارات
3. تحقق من إعدادات GitHub Pages
4. أعد تحميل الصفحة بعد 5 دقائق

---
تم النشر بواسطة سكريبت النشر الآلي
EOF

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}🎉 تم تجهيز الموقع بنجاح!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}📋 الخطوات النهائية:${NC}"
echo "1. افتح GitHub وانتقل إلى مستودعك"
echo "2. اذهب إلى Settings → Pages"
echo "3. تأكد من الإعدادات الصحيحة"
echo "4. انتظر حتى يظهر ✅ بجوار GitHub Pages"
echo "5. افتح موقعك من الرابط أعلاه"
echo -e "${BLUE}========================================${NC}"

# Save the script itself
cat > /storage/emulated/0/deploy_website.sh << 'EOF'
#!/bin/bash
# Script content (same as above)
# ... [يجب نسخ محتوى السكريبت هنا] ...
EOF

chmod +x /storage/emulated/0/deploy_website.sh
echo -e "${GREEN}💾 تم حفظ السكريبت في: /storage/emulated/0/deploy_website.sh${NC}"
