'use strict';

/*
  Task 3 - Student Results Management System
  - Private fields + setters for grades and attendance
  - DOM interaction + try/catch
  - filter, map and reduce for the grace committee
*/

// =========================
// 1) Student Class
// =========================
class Student {
  static nextId = 1;

  #grades;
  #attendance;

  constructor(name, grades, attendance) {
    const cleanName = String(name ?? '').trim();

    if (cleanName === '') {
      throw new Error('من فضلك أدخل اسم الطالب.');
    }

    this.id = Student.nextId++;
    this.name = cleanName;
    this.grades = grades;           // تمر على set grades
    this.attendance = attendance;   // تمر على set attendance
  }

  // التحقق من الدرجات وتخزينها داخل حقل خاص
  set grades(value) {
    if (!Array.isArray(value) || value.length !== 3) {
      throw new Error('يجب إدخال درجات المواد الثلاث جميعها.');
    }

    const validatedGrades = value.map((grade, index) => {
      if (grade === '' || grade === null || grade === undefined) {
        throw new Error(`من فضلك أدخل درجة المادة رقم ${index + 1}.`);
      }

      const numericGrade = Number(grade);

      if (!Number.isFinite(numericGrade) || numericGrade < 0 || numericGrade > 100) {
        throw new Error(`درجة المادة رقم ${index + 1} يجب أن تكون رقمًا من 0 إلى 100.`);
      }

      return numericGrade;
    });

    this.#grades = validatedGrades;
  }

  get grades() {
    return [...this.#grades]; // إرجاع نسخة لحماية المصفوفة الأصلية
  }

  // التحقق من نسبة الحضور وتخزينها داخل حقل خاص
  set attendance(value) {
    if (value === '' || value === null || value === undefined) {
      throw new Error('من فضلك أدخل نسبة الحضور.');
    }

    const numericAttendance = Number(value);

    if (!Number.isFinite(numericAttendance) ||
        numericAttendance < 0 || numericAttendance > 100) {
      throw new Error('نسبة الحضور يجب أن تكون رقمًا من 0 إلى 100.');
    }

    this.#attendance = numericAttendance;
  }

  get attendance() {
    return this.#attendance;
  }

  // حساب متوسط درجات الطالب
  getAverage() {
    const total = this.#grades.reduce((sum, grade) => sum + grade, 0);
    return total / this.#grades.length;
  }
}

// =========================
// 2) DOM Elements
// =========================
const studentForm = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const grade1Input = document.getElementById('grade1');
const grade2Input = document.getElementById('grade2');
const grade3Input = document.getElementById('grade3');
const attendanceInput = document.getElementById('attendance');

const errorBox = document.getElementById('errorBox');
const successBox = document.getElementById('successBox');
const studentsListBox = document.getElementById('studentsList');
const studentsCount = document.getElementById('studentsCount');
const graceButton = document.getElementById('graceButton');
const reportBox = document.getElementById('reportBox');

// سلة حفظ الطلاب
const studentsList = [];

// =========================
// 3) Helper Functions
// =========================
function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove('d-none');
  successBox.classList.add('d-none');
}

function showSuccess(message) {
  successBox.textContent = message;
  successBox.classList.remove('d-none');
  errorBox.classList.add('d-none');
}

function clearMessages() {
  errorBox.textContent = '';
  errorBox.classList.add('d-none');
  successBox.textContent = '';
  successBox.classList.add('d-none');
}

// حماية النصوص التي نضعها داخل HTML من تفسيرها كوسوم
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return entities[character];
  });
}

function renderStudents() {
  studentsCount.textContent = `${studentsList.length} طالب`;

  if (studentsList.length === 0) {
    studentsListBox.innerHTML = '<p class="text-secondary mb-0">لم تتم إضافة أي طالب حتى الآن.</p>';
    return;
  }

  studentsListBox.innerHTML = studentsList.map((student) => `
    <div class="student-item d-flex flex-column flex-md-row justify-content-between gap-2">
      <div>
        <strong>${escapeHTML(student.name)}</strong>
        <div class="small text-secondary">رقم الطالب: ${student.id}</div>
      </div>
      <div class="small">
        <span>المتوسط: <strong>${student.getAverage().toFixed(2)}</strong></span>
        <span class="me-3">الحضور: <strong>${student.attendance.toFixed(2)}%</strong></span>
      </div>
    </div>
  `).join('');
}

// =========================
// 4) Add Student - DOM + Try/Catch
// =========================
studentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearMessages();

  try {
    const name = studentNameInput.value;
    const grades = [
      grade1Input.value,
      grade2Input.value,
      grade3Input.value
    ];
    const attendance = attendanceInput.value;

    // إنشاء كائن جديد؛ أي قيمة غير صحيحة ستؤدي إلى رمي Error من الـ setters
    const newStudent = new Student(name, grades, attendance);

    studentsList.push(newStudent);
    renderStudents();

    studentForm.reset();
    reportBox.innerHTML = '<p class="text-secondary mb-0">تمت إضافة طالب جديد. أعد تفعيل اللجنة لتحديث التقرير.</p>';
    showSuccess(`تمت إضافة الطالب "${newStudent.name}" بنجاح.`);
    studentNameInput.focus();
  } catch (error) {
    showError(error.message);
  }
});

// =========================
// 5) Grace Committee - filter, map, reduce
// =========================
graceButton.addEventListener('click', () => {
  clearMessages();

  // Filter: الطلاب الذين متوسط درجاتهم من 40 إلى 49 شاملًا
  const strugglingStudents = studentsList.filter((student) => {
    const average = student.getAverage();
    return average >= 40 && average <= 49;
  });

  if (strugglingStudents.length === 0) {
    reportBox.innerHTML = `
      <div class="alert alert-info mb-0">
        لا يوجد طلاب متعثرون متوسط درجاتهم بين 40 و49.
        <br>
        <strong>عدد الطلاب المتعثرين: 0</strong>
      </div>
    `;
    return;
  }

  // Map: إضافة 5 درجات رأفة إلى متوسط كل طالب متعثر
  const studentsAfterGrace = strugglingStudents.map((student) => ({
    name: student.name,
    oldAverage: student.getAverage(),
    newAverage: student.getAverage() + 5
  }));

  // Reduce: جمع المتوسطات بعد الرأفة
  const totalAfterGrace = studentsAfterGrace.reduce((sum, student) => {
    return sum + student.newAverage;
  }, 0);

  // منع القسمة على صفر (والشرط موجود أيضًا قبل الوصول لهذه المرحلة)
  const generalAverage = studentsAfterGrace.length > 0
    ? totalAfterGrace / studentsAfterGrace.length
    : 0;

  const studentsHTML = studentsAfterGrace.map((student) => `
    <div class="report-student d-flex flex-column flex-sm-row justify-content-between gap-2">
      <strong>${escapeHTML(student.name)}</strong>
      <span>
        قبل الرأفة: ${student.oldAverage.toFixed(2)}
        <span class="text-success fw-bold me-2">
          بعد الرأفة: ${student.newAverage.toFixed(2)}
        </span>
      </span>
    </div>
  `).join('');

  // Template Literals لعرض التقرير داخل الصفحة
  reportBox.innerHTML = `
    <div class="row g-3 mb-3">
      <div class="col-12 col-md-6">
        <div class="stat-box">
          <div class="text-secondary small">عدد الطلاب المتعثرين</div>
          <div class="fs-4 fw-bold">${studentsAfterGrace.length}</div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="stat-box">
          <div class="text-secondary small">المتوسط العام بعد الرأفة</div>
          <div class="fs-4 fw-bold text-success">${generalAverage.toFixed(2)}</div>
        </div>
      </div>
    </div>
    <h3 class="h6 fw-bold mb-3">أسماء الطلاب ونتائجهم بعد الرأفة</h3>
    ${studentsHTML}
    <p class="small text-secondary mt-3 mb-0">
      تم إضافة 5 درجات إلى متوسط كل طالب متعثر، وفقًا لمطلوب التكليف.
    </p>
  `;
});
