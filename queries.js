// 1 students with credits greater than 50 ordered by courses.

db.enrollment.aggregate([
  {
    $unwind: "$students"
  }, {
    $group: {
      _id: "$students._id",
      "course": {
        $push: "$course"
      },
      "totalCredits": {
        $sum: "$students.credits"
      }
    }
  }, {
    $match: {
      "totalCredits": {
        $gt: 50
      }
    }
  }, {
    $lookup: {
      from: "students",
      localField: "_id",
      foreignField: "_id",
      as: "student"
    }
  }, {
    $lookup: {
      from: "courses",
      localField: "course",
      foreignField: "_id",
      as: "course"
    }
  },
  {
    $project: {
      _id: 1,
      name: 1,
      student: {$first: "$student"},
      course: "$course.name",
      totalCredits: 1
    }
  }, {
    $unwind: "$course"
  },
  { //order by course
    $sort: {
      course: 1
    }
  }, {
    $group: {
      _id: "$student._id",
      name: {
        $first: "$student.name"
      },
      courses: {
        $push: "$course"
      }
    }
  }
]);


// 2 courses with more students.

db.enrollment.aggregate([
  {
    $lookup: {
      from: "courses",
      localField: "course",
      foreignField: "_id",
      as: "enrollmentCourse"
    }
  }, {
    $project: {
      "_id": 1,
      "course": 1,
      "name": {
        $first: "$enrollmentCourse.name"
      },
      "students": 1
    }
  }, {
    $group: {
      _id: "$course",
      "name": {
        $first: "$name"
      },
      "totalStudents": {
        $sum: {
          $size: "$students"
        }
      }
    }
  },
  {
    $sort: {
      totalStudents: -1
    }
  }]);


//3 student, their courses and credits

db.enrollment.aggregate([
  {
    $unwind: "$students"
  }, {
    $group: {
      _id: "$students._id",
      "course": {
        $first: "$course"
      },
      "totalCredits": {
        $sum: "$students.credits"
      }
    }
  }, {
    $project: {
      "totalCredits": 1
    }
  }, {
    $lookup: {
      from: "students",
      localField: "_id",
      foreignField: "_id",
      as: "student"
    },
  }, {
    $unwind: "$student"
  }, {
    $lookup: {
      from: "enrollment",
      localField: "_id",
      foreignField: "students._id",
      as: "enrollments"
    }
  }, {
    $lookup: {
      from: "courses",
      localField: "enrollments.course",
      foreignField: "_id",
      as: "courses"
    }
  }, {
    $project: {
      _id: 0,
      name: "$student.name",
      totalCredits: "$totalCredits",
      courses: "$courses.name"
    }
  }]);


// 4 course, its students and credits, all the information of both

db.courses.aggregate([
  {
    $lookup: {
      from: "enrollment",
      localField: "_id",
      foreignField: "course",
      as: "enrollments"
    }
  }, {
    $unwind: "$enrollments"
  }, {
    $project: {
      _id: 1,
      name: "$name",
      students: "$enrollments.students"
    }
  }, {
    $unwind: "$students"
  },
  {
    $lookup: {
      from: "students",
      localField: "students._id",
      foreignField: "_id",
      as: "students.data"
    }
  },
  {
    $unwind: "$students.data"
  },
  {
    $project: {
      _id: 1,
      name: "$name",
      students: {
        _id: "$students._id",
        name: "$students.data.name",
        credits: "$students.credits"
      }
    }
  }, {
    $group: {
      _id: "$_id",
      name: {$first: "$name"},
      students: {
        $push: "$students"
      }
    }
  }
]);
