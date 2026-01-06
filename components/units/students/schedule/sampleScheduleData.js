// Sample schedule data generator for students
// This creates realistic schedule data for the current week

export const generateSampleScheduleData = (weekOffset = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const daysFromSaturday = (currentDay + 1) % 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysFromSaturday);
    startOfWeek.setDate(startOfWeek.getDate() + (weekOffset * 7));

    const schedule = [];
    const subjects = [
        {
            id: 1,
            subjectName: 'الرياضيات',
            partName: 'الجبر',
            progress: 85,
            exercises: [
                { id: 1, title: 'واجب الحصة الأولى', duration: 180, date: '26 August', score: 100 },
                { id: 2, title: 'اختبار الحصة الأولى', duration: 97, date: '26 August', score: 100 }
            ],
            videos: [
                { id: 1, title: 'شرح - ج - موقع وطننا العربي', duration: 32, completed: true }
            ]
        },
        {
            id: 2,
            subjectName: 'الفيزياء',
            partName: 'الحركة',
            progress: 72,
            exercises: [
                { id: 3, title: 'اختبار الحصة الأولى', duration: 97, date: '26 August', score: 100 },
                { id: 4, title: 'اختبار الحصة الأولى', duration: 45, date: '26 August', score: 96 }
            ],
            videos: [
                { id: 2, title: 'شرح - ج - موقع وطننا العربي', duration: 33, completed: true },
                { id: 3, title: 'أهم أسئلة الكتب الخارجية', duration: 33, completed: true }
            ]
        },
        {
            id: 3,
            subjectName: 'اللغة العربية',
            partName: 'النحو',
            progress: 90,
            exercises: [
                { id: 5, title: 'واجب الحصة الأولى', duration: 60, date: '27 August', score: 100 }
            ],
            videos: [
                { id: 4, title: 'شرح - النحو الأساسي', duration: 25, completed: true }
            ]
        },
        {
            id: 4,
            subjectName: 'الكيمياء',
            partName: 'التفاعلات',
            progress: 45,
            exercises: [
                { id: 6, title: 'اختبار الحصة الأولى', duration: 90, date: '28 August', score: 45 }
            ],
            videos: [
                { id: 5, title: 'شرح - التفاعلات الكيميائية', duration: 40, completed: false }
            ]
        },
        {
            id: 5,
            subjectName: 'اللغة الإنجليزية',
            partName: 'القراءة',
            progress: 80,
            exercises: [
                { id: 7, title: 'Reading Comprehension', duration: 45, date: '29 August', score: 80 }
            ],
            videos: [
                { id: 6, title: 'English Reading Lesson', duration: 20, completed: true }
            ]
        },
        {
            id: 6,
            subjectName: 'التاريخ',
            partName: 'العصر الإسلامي',
            progress: 70,
            exercises: [
                { id: 8, title: 'اختبار الحصة الأولى', duration: 60, date: '30 August', score: 70 }
            ],
            videos: [
                { id: 7, title: 'شرح - العصر الإسلامي', duration: 35, completed: true }
            ]
        }
    ];

    // Generate schedule for each day of the week
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();

        // Saturday (6) - Math, Physics, Arabic
        if (dayOfWeek === 6) {
            schedule.push({
                date: dateString,
                dailyProgress: 78,
                isHoliday: false,
                subjects: [
                    { ...subjects[0], progress: 85 }, // Math
                    { ...subjects[1], progress: 72 }, // Physics
                    { ...subjects[2], progress: 90 }  // Arabic
                ]
            });
        }
        // Sunday (0) - Chemistry, English, History
        else if (dayOfWeek === 0) {
            schedule.push({
                date: dateString,
                dailyProgress: 65,
                isHoliday: false,
                subjects: [
                    { ...subjects[3], progress: 45 }, // Chemistry
                    { ...subjects[4], progress: 80 }, // English
                    { ...subjects[5], progress: 70 }  // History
                ]
            });
        }
        // Monday (1) - Math, Physics
        else if (dayOfWeek === 1) {
            schedule.push({
                date: dateString,
                dailyProgress: 82,
                isHoliday: false,
                subjects: [
                    { ...subjects[0], progress: 88 },
                    { ...subjects[1], progress: 76 }
                ]
            });
        }
        // Tuesday (2) - Chemistry, Arabic
        else if (dayOfWeek === 2) {
            schedule.push({
                date: dateString,
                dailyProgress: 55,
                isHoliday: false,
                subjects: [
                    { ...subjects[3], progress: 50 },
                    { ...subjects[2], progress: 60 }
                ]
            });
        }
        // Wednesday (3) - English, History
        else if (dayOfWeek === 3) {
            schedule.push({
                date: dateString,
                dailyProgress: 75,
                isHoliday: false,
                subjects: [
                    { ...subjects[4], progress: 85 },
                    { ...subjects[5], progress: 65 }
                ]
            });
        }
        // Thursday (4) - Math, Chemistry
        else if (dayOfWeek === 4) {
            schedule.push({
                date: dateString,
                dailyProgress: 70,
                isHoliday: false,
                subjects: [
                    { ...subjects[0], progress: 90 },
                    { ...subjects[3], progress: 50 }
                ]
            });
        }
        // Friday (5) - Holiday
        else if (dayOfWeek === 5) {
            schedule.push({
                date: dateString,
                dailyProgress: 0,
                isHoliday: true,
                subjects: []
            });
        }
    }

    return schedule;
};

// Generate schedule data for a specific student with variations
export const generateStudentSchedule = (studentId, weekOffset = 0) => {
    const baseSchedule = generateSampleScheduleData(weekOffset);

    // Add some variation based on student ID
    const variation = studentId % 5;

    return baseSchedule.map(day => {
        if (day.isHoliday) return day;

        return {
            ...day,
            subjects: day.subjects.map(subject => {
                // Vary progress slightly based on student
                const progressVariation = (variation * 3) - 6; // -6 to +6
                const newProgress = Math.max(0, Math.min(100, subject.progress + progressVariation));

                return {
                    ...subject,
                    progress: newProgress,
                    // Clone exercises and videos to avoid reference issues
                    exercises: subject.exercises.map(ex => ({ ...ex })),
                    videos: subject.videos.map(vid => ({ ...vid }))
                };
            }),
            dailyProgress: Math.round(
                day.subjects.reduce((sum, s) => {
                    const progressVariation = (variation * 3) - 6;
                    return sum + Math.max(0, Math.min(100, s.progress + progressVariation));
                }, 0) / day.subjects.length
            )
        };
    });
};

