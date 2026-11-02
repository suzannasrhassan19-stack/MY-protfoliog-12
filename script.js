//student Management System

// 1. Create Student Class
class Student {
    constructor(id, name, grades, attendance) {
        this.id = id;
        this.name = name;
        this.grades = grades;
        this.attendance = attendance;
    }

    // 2. Calculate Average
    calculateAverage() {
        let total = this.grades.reduce((sum, grade) => sum + grade, 0);
        return total / this.grades.length;
    }

    // 3. Calculate Grade
    getGrade() {
        let average = this.calculateAverage();

        if (average >= 90) {
            return "A";
        } else if (average >= 80) {
            return "B";
        } else if (average >= 70) {
            return "C";
        } else if (average >= 60) {
            return "D";
        } else if (average >= 50) {
            return "E";
        } else {
            return "F";
        }
    }

    // 4. Check Final Result
    getFinalResult() {
        let average = this.calculateAverage();

        if (average >= 50 && this.attendance >= 75) {
            return "ناجح";
        } else {
            return "يحتاج مراجعة";
        }
    }
}

// 5. Create Students Objects
let studentsList = [
    new Student(101, "Ahmed", [90, 85, 95], 90),
    new Student(102, "Sara", [60, 65, 70], 80),
    new Student(103, "Mohamed", [40, 45, 45], 85),
    new Student(104, "Mona", [50, 45, 45], 90)
];

// 6. Filter Students Who Need Mercy Grades
let weakStudents = studentsList.filter(student => {
    let average = student.calculateAverage();
    return average >= 40 && average <= 49;
});

// 7. Add 5 Mercy Grades Using Map
let mercyStudents = weakStudents.map(student => {
    let newAverage = student.calculateAverage() + 5;

    return {
        id: student.id,
        name: student.name,
        oldAverage: student.calculateAverage(),
        newAverage: newAverage,
newGrade:
            newAverage >= 90 ? "A" :
            newAverage >= 80 ? "B" :
            newAverage >= 70 ? "C" :
            newAverage >= 60 ? "D" :
            newAverage >= 50 ? "E" : "F",

        newResult:
            newAverage >= 50 && student.attendance >= 75
                ? "ناجح"
                : "يحتاج مراجعة"
    };
});
// 8. Calculate New Averages Using Reduce
let totalNewAverages = mercyStudents.reduce((sum, student) => {
    return sum + student.newAverage;
}, 0);

// 9. Calculate Mercy Average With Zero Protection
let mercyAverage = mercyStudents.length > 0
    ? totalNewAverages / mercyStudents.length
    : 0;

// 10. Print Report For All Students
console.log("===== Students Reports =====");

studentsList.forEach(student => {
    console.log("--------------------");
    console.log("Student Name:", student.name);
    console.log("Average:", student.calculateAverage());
    console.log("Grade:", student.getGrade());
    console.log("Final Result:", student.getFinalResult());
});

// 11. Print Mercy Students
console.log("===== Mercy Students =====");
console.log(mercyStudents);

// 12. Print Mercy Average
console.log("===== Mercy Average =====");
console.log(mercyAverage);