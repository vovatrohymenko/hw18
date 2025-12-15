let studentsData = [];

const getStudentsBtn = document.querySelector("#get-students-btn");
const addStudentForm = document.querySelector(".add-student-form");

function getStudents() {
  fetch("students.json")
    .then((res) => res.json())
    .then((data) => {
      studentsData = data.students;
      renderStudents(studentsData);
    })
    .catch((err) => {
      console.error(err);
      alert("Не вдалося завантажити студентів");
    });
}

function renderStudents(students) {
  const tbody = document.querySelector("#students-table tbody");
  tbody.innerHTML = "";

  students.forEach((student) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.course}</td>
      <td>${student.skills.join(", ")}</td>
      <td>${student.email}</td>
      <td>${student.isEnrolled ? "Так" : "Ні"}</td>
      <td>
        <button class="update-btn">Оновити</button>
        <button class="delete-btn">Видалити</button>
      </td>
    `;

    tr.querySelector(".update-btn").addEventListener("click", () =>
      updateStudent(student.id)
    );
    tr.querySelector(".delete-btn").addEventListener("click", () =>
      deleteStudent(student.id)
    );

    tbody.appendChild(tr);
  });
}

function addStudent(e) {
  e.preventDefault();
  const form = e.target;

  const newStudent = {
    id: studentsData.length ? studentsData[studentsData.length - 1].id + 1 : 1,
    name: form.querySelector("#name").value.trim(),
    age: Number(form.querySelector("#age").value),
    course: form.querySelector("#course").value.trim(),
    skills: form
      .querySelector("#skills")
      .value.split(",")
      .map((s) => s.trim()),
    email: form.querySelector("#email").value.trim(),
    isEnrolled: form.querySelector("#isEnrolled").checked,
  };

  studentsData.push(newStudent);
  renderStudents(studentsData);
  form.reset();
}

function updateStudent(id) {
  const student = studentsData.find((s) => s.id === id);
  if (!student) return;

  const updatedData = {
    name: prompt("Введіть нове ім'я студента:", student.name) || student.name,
    age:
      Number(prompt("Введіть новий вік студента:", student.age)) || student.age,
    course:
      prompt("Введіть новий курс студента:", student.course) || student.course,
    skills:
      prompt("Введіть нові навички через кому:", student.skills.join(","))
        ?.split(",")
        .map((s) => s.trim()) || student.skills,
    email: prompt("Введіть новий email:", student.email) || student.email,
    isEnrolled: confirm("Студент записаний?"),
  };

  student.name = updatedData.name;
  student.age = updatedData.age;
  student.course = updatedData.course;
  student.skills = updatedData.skills;
  student.email = updatedData.email;
  student.isEnrolled = updatedData.isEnrolled;

  renderStudents(studentsData);
}

function deleteStudent(id) {
  if (!confirm("Ви впевнені, що хочете видалити цього студента?")) return;
  studentsData = studentsData.filter((s) => s.id !== id);
  renderStudents(studentsData);
}

getStudentsBtn.addEventListener("click", getStudents);
addStudentForm.addEventListener("submit", addStudent);
