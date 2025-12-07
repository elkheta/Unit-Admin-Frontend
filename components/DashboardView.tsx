import React, { useState } from 'react';
import { NavItemId, Unit } from '../App';
import { 
  Package, PlusCircle, CheckSquare, CheckCircle2, User, Search, Filter, 
  MoreVertical, FileText, Send, Settings, Check, 
  Eye, Gem, BarChart2, BookOpen, MessageCircle, Monitor, ChevronDown, X,
  ArrowRightLeft, Users, ChevronRight, Edit3, Trash2, Calendar, Phone, Mail, Save, Plus,
  StickyNote, Clock, AlertCircle, Archive, History, RefreshCw, UserCog, Tag, Copy, EyeOff, ListTodo
} from 'lucide-react';

interface DashboardViewProps {
  activeTab: NavItemId;
  onUnitSelect?: (unit: Unit, targetTab?: NavItemId) => void;
  onTabChange?: (tab: NavItemId) => void;
  selectedUnit?: Unit | null;
}

interface Student {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    lastMessageTime: string;
    progress: number;
    score: number;
    diamonds: number;
    lastSeen: string;
    status: string;
    tags: string[];
}

interface ReminderItem {
    id: number;
    description: string;
    personName: string;
    group: string;
    unit: string;
    status: string;
    dueDate: string;
    statusIndicator: string; // e.g., "Overdue", "Due Soon", etc.
    studentId?: number; // Optional: to link to student in student list
}

interface LabelItem {
    id: number;
    name: string;
    category: string;
    description: string;
    creationDate: string;
}

interface TaskItem {
    id: number;
    name: string;
    assignedGroups: number;
    progressCount: number;
    progressTotal: number;
    progressPercent: number;
    reportAvailable: boolean;
    startDate: string;
    expirationDate: string;
    description: string;
    status: 'active' | 'expired';
    visibility: 'visible' | 'hidden';
}

const DashboardView: React.FC<DashboardViewProps> = ({ activeTab, onUnitSelect, onTabChange, selectedUnit }) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // State for Labels
  const [labels, setLabels] = useState<LabelItem[]>([
    { id: 1, name: "VIP", category: "Status", description: "Very Important Person", creationDate: "2024-01-15" },
    { id: 2, name: "New", category: "Status", description: "Newly joined student", creationDate: "2024-03-10" },
    { id: 3, name: "Warning", category: "Behavior", description: "Student has warnings", creationDate: "2024-02-22" },
    { id: 4, name: "Excellent", category: "Academic", description: "Top performing student", creationDate: "2024-01-20" },
  ]);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<Partial<LabelItem>>({});

  // State for Task Filters
  const [isStartDateFilterOpen, setIsStartDateFilterOpen] = useState(false);
  
  // State for Add Task Form
  const [assignmentMethod, setAssignmentMethod] = useState<'all' | 'conditions'>('all');
  const [selectedUnits, setSelectedUnits] = useState<Set<number>>(new Set());
  const [selectedLabels, setSelectedLabels] = useState<Set<number>>(new Set());
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [description, setDescription] = useState('');
  
  // State for Assignment Conditions Filters
  const [progressFilterEnabled, setProgressFilterEnabled] = useState(false);
  const [progressFrom, setProgressFrom] = useState(0);
  const [progressTo, setProgressTo] = useState(100);
  const [diamondsFilterEnabled, setDiamondsFilterEnabled] = useState(false);
  const [diamondsFrom, setDiamondsFrom] = useState(0);
  const [diamondsTo, setDiamondsTo] = useState(50);
  const [lessonsFilterEnabled, setLessonsFilterEnabled] = useState(false);
  const [lessonsFrom, setLessonsFrom] = useState(0);
  const [lessonsTo, setLessonsTo] = useState(50);
  const [lastSeenSiteFilterEnabled, setLastSeenSiteFilterEnabled] = useState(false);
  const [lastSeenSiteDays, setLastSeenSiteDays] = useState(7);
  const [lastSeenChatFilterEnabled, setLastSeenChatFilterEnabled] = useState(false);
  const [lastSeenChatDays, setLastSeenChatDays] = useState(7);
  
  // Mock Grades and Units data
  interface Unit {
    id: number;
    name: string;
    students: number;
  }
  
  interface Grade {
    id: number;
    name: string;
    units: Unit[];
  }
  
  const grades: Grade[] = [
    {
      id: 1,
      name: 'Senior 3',
      units: [
        { id: 1, name: 'S3 - Rania', students: 61 },
        { id: 2, name: 'S3 - Ahmed', students: 45 },
      ]
    },
    {
      id: 2,
      name: 'Senior Two',
      units: [
        { id: 3, name: 'Senior Two - Alia', students: 40 },
        { id: 4, name: 'Senior Two - Mohamed', students: 52 },
      ]
    },
    {
      id: 3,
      name: 'Junior Two',
      units: [
        { id: 5, name: 'Junior Two - Ahmed Hassan', students: 38 },
        { id: 6, name: 'Junior Two - Sara', students: 42 },
      ]
    }
  ];
  
  // Mock Labels data for Task Assignment
  const taskLabels = [
    { id: 1, name: 'VIP' },
    { id: 2, name: 'Excellent' },
    { id: 3, name: 'New' },
    { id: 4, name: 'Warning' },
    { id: 5, name: 'Priority' },
  ];
  
  const handleSelectAllGrades = (checked: boolean) => {
    if (checked) {
      const allUnitIds = new Set<number>();
      grades.forEach(grade => {
        grade.units.forEach(unit => allUnitIds.add(unit.id));
      });
      setSelectedUnits(allUnitIds);
    } else {
      setSelectedUnits(new Set());
    }
  };
  
  const handleSelectGrade = (gradeId: number, checked: boolean) => {
    const grade = grades.find(g => g.id === gradeId);
    if (!grade) return;
    
    const newSet = new Set(selectedUnits);
    grade.units.forEach(unit => {
      if (checked) {
        newSet.add(unit.id);
      } else {
        newSet.delete(unit.id);
      }
    });
    setSelectedUnits(newSet);
  };
  
  const handleUnitToggle = (unitId: number, checked: boolean) => {
    const newSet = new Set(selectedUnits);
    if (checked) {
      newSet.add(unitId);
    } else {
      newSet.delete(unitId);
    }
    setSelectedUnits(newSet);
  };
  
  const handleSelectAllLabels = (checked: boolean) => {
    if (checked) {
      setSelectedLabels(new Set(taskLabels.map(l => l.id)));
    } else {
      setSelectedLabels(new Set());
    }
  };
  
  const handleLabelToggle = (labelId: number, checked: boolean) => {
    const newSet = new Set(selectedLabels);
    if (checked) {
      newSet.add(labelId);
    } else {
      newSet.delete(labelId);
    }
    setSelectedLabels(newSet);
  };
  
  const allGradesSelected = grades.length > 0 && grades.every(grade => 
    grade.units.every(unit => selectedUnits.has(unit.id))
  );
  const allLabelsSelected = taskLabels.length > 0 && taskLabels.every(l => selectedLabels.has(l.id));
  
  const isGradeSelected = (gradeId: number) => {
    const grade = grades.find(g => g.id === gradeId);
    if (!grade) return false;
    return grade.units.every(unit => selectedUnits.has(unit.id));
  };
  
  const totalSelectedStudents = grades
    .flatMap(grade => grade.units)
    .filter(unit => selectedUnits.has(unit.id))
    .reduce((sum, unit) => sum + unit.students, 0);
  
  // Mock Tasks Data
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
        id: 1,
        name: "g1 diamond above 21",
        assignedGroups: 1,
        progressCount: 0,
        progressTotal: 1,
        progressPercent: 0,
        reportAvailable: false,
        startDate: "11/2/2025",
        expirationDate: "11/9/2025",
        description: "No description",
        status: "active",
        visibility: "visible"
    },
    {
        id: 2,
        name: "group 1 task",
        assignedGroups: 1,
        progressCount: 1,
        progressTotal: 2,
        progressPercent: 50,
        reportAvailable: false,
        startDate: "11/2/2025",
        expirationDate: "11/9/2025",
        description: "No description",
        status: "active",
        visibility: "visible"
    },
    {
        id: 3,
        name: "متابعة الطلاب الغائبين",
        assignedGroups: 3,
        progressCount: 3,
        progressTotal: 3,
        progressPercent: 100,
        reportAvailable: true,
        startDate: "11/5/2025",
        expirationDate: "11/12/2025",
        description: "متابعة الطلاب الغائبين عن الحصة السابقة",
        status: "active",
        visibility: "visible"
    }
  ]);

  // State for Notes Popup
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [currentNotesStudent, setCurrentNotesStudent] = useState<Student | null>(null);
  const [showCustomDateInput, setShowCustomDateInput] = useState(false);
  const [activeNoteTab, setActiveNoteTab] = useState<'recent' | 'archived' | 'notes'>('recent');

  // Mock Notes Data
  const mockNotes = [
    { id: 1, type: 'note', text: 'Student promised to complete the assignment by tomorrow.', date: 'Today, 10:30 AM', author: 'You' },
    { id: 2, type: 'reminder', text: 'Follow up on payment.', date: 'Yesterday, 4:15 PM', author: 'System' },
    { id: 3, type: 'note', text: 'Parent called regarding the physics exam results.', date: 'Nov 24, 2025', author: 'Admin' },
  ];

  // Reminder/Action Items Data
  const [reminders, setReminders] = useState<ReminderItem[]>([
    {
      id: 1,
      description: "Contact parent regarding progress",
      personName: "Dina Sayed",
      group: "Group A",
      unit: "S3 - Rania",
      status: "Pending",
      dueDate: "Sep 20",
      statusIndicator: "Overdue",
      studentId: 1
    },
    {
      id: 2,
      description: "هكلمها بخصوص",
      personName: "Rania Farid",
      group: "Group A",
      unit: "S3 - Rania",
      status: "Pending",
      dueDate: "Sep 25",
      statusIndicator: "Overdue",
      studentId: 2
    }
  ]);
  
  // Data structure for the main dashboard grid
  const units = [
    {
      id: 2,
      title: "S3 - Rania",
      subtitle: "Unit created for S3 - Rania",
      badge: "Senior 3",
      students: 61,
      outside: 15,
      availableCapacity: 39,
      reminders: 2,
      totalGroups: 3,
    },
    {
      id: 3,
      title: "Senior Two - Alia",
      subtitle: "Unit created for Senior Two - Alia",
      badge: "Senior Two",
      students: 40,
      outside: 10,
      availableCapacity: 60,
      reminders: 0,
      totalGroups: 3,
    }
  ];

  // Extended Data structure for the "Mains Overview" list
  const mainsList = [
    {
      id: 2,
      title: "S3 - Rania",
      active: 120,
      outside: 15,
      expired: 5,
      lost: 2,
      adminName: "Rania Farid",
      adminPhone: "+201000000001",
      pendingTasks: 3,
      avgProgress: 86
    },
    {
      id: 3,
      title: "Senior Two - Alia",
      active: 45,
      outside: 0,
      expired: 0,
      lost: 0,
      adminName: "Alia Ahmed",
      adminPhone: "+201000000002",
      pendingTasks: 0,
      avgProgress: 72
    },
    {
      id: 104,
      title: "Junior Two - Ahmed Hassan",
      active: 200,
      outside: 12,
      expired: 8,
      lost: 1,
      adminName: "Ahmed Hassan",
      adminPhone: "+201000000003",
      pendingTasks: 5,
      avgProgress: 91
    }
  ];

  // Mock Admins Data
  const admins = [
    {
      id: 1,
      name: "Rania Farid",
      phone: "+201000000001",
      email: "rania@example.com",
      supervisor: "Supervisor A",
      linkedUnits: "S3 - Rania"
    },
    {
      id: 2,
      name: "Alia Ahmed",
      phone: "+201000000002",
      email: "alia@example.com",
      supervisor: "Supervisor B",
      linkedUnits: "Senior Two - Alia"
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      phone: "+201000000003",
      email: "ahmed@example.com",
      supervisor: "Supervisor A",
      linkedUnits: "Junior Two - Ahmed Hassan"
    },
     {
       id: 4,
       name: "New Admin",
       phone: "+201000000004",
       email: "new@example.com",
       supervisor: "Supervisor C",
       linkedUnits: "No units assigned"
     }
   ];

  // Mock Supervisors Data
  const supervisors = [
    {
      id: 1,
      name: "Supervisor A",
      phone: "+201111111111",
      email: "supervisor.a@example.com",
      grade: "Senior 3",
      linkedUnits: "S3 - Rania, Junior Two - Ahmed Hassan"
    },
    {
      id: 2,
      name: "Supervisor B",
      phone: "+201222222222",
      email: "supervisor.b@example.com",
      grade: "Senior Two",
      linkedUnits: "Senior Two - Alia"
    },
    {
      id: 3,
      name: "Supervisor C",
      phone: "+201333333333",
      email: "supervisor.c@example.com",
      grade: "Junior Two",
      linkedUnits: "No units assigned"
    }
  ];

  // Updated placeholder data to match the screenshot design
  const students: Student[] = [
    { 
      id: 1, 
      name: "Salma Ibrahim",
      firstName: "Salma",
      lastName: "Ibrahim",
      phone: "+201333222111", 
      lastMessageTime: "2d ago",
      progress: 86,
      score: 0,
      diamonds: 16,
      lastSeen: "3 days",
      status: "Active",
      tags: []
    },
    { 
      id: 2, 
      name: "Mostafa Gamal", 
      firstName: "Mostafa",
      lastName: "Gamal",
      phone: "+201444333222", 
      lastMessageTime: "2d ago",
      progress: 86,
      score: 0,
      diamonds: 30,
      lastSeen: "2 days",
      status: "Active",
      tags: ["Excellent"]
    },
  ];

  // Collapsible Section Component
  const CollapsibleSection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-t border-gray-100 py-4">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{title}</h4>
                <ChevronDown size={16} className={`text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="animate-fade-in">{children}</div>}
        </div>
    );
  };

  const openNotesModal = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setCurrentNotesStudent(student);
    setIsNotesModalOpen(true);
    setShowCustomDateInput(false);
  };

  // Reminder action handlers
  const handleCompleteReminder = (reminderId: number) => {
    setReminders(reminders.filter(r => r.id !== reminderId));
  };

  const handleDismissReminder = (reminderId: number) => {
    setReminders(reminders.filter(r => r.id !== reminderId));
  };

  const handleViewStudent = (reminder: ReminderItem) => {
    if (reminder.studentId && onUnitSelect) {
      // Find the unit that contains this student and navigate to it
      // For now, we'll just select the first unit as a placeholder
      const unit = units.find(u => u.id === 2); // You can enhance this logic
      if (unit) {
        onUnitSelect({ id: unit.id, title: unit.title });
        // You might want to set the active tab to unit-student-list here
      }
    }
  };

  // Label handlers
  const handleEditLabel = (label: LabelItem) => {
    setCurrentLabel(label);
    setIsLabelModalOpen(true);
  };

  const handleDeleteLabel = (id: number) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
        setLabels(labels.filter(l => l.id !== id));
    }
  };

  const handleSaveLabel = () => {
      if (currentLabel.id) {
          // Edit
          setLabels(labels.map(l => l.id === currentLabel.id ? { ...l, ...currentLabel } as LabelItem : l));
      } else {
          // Add
          const newLabel: LabelItem = {
              id: Math.max(...labels.map(l => l.id), 0) + 1,
              name: currentLabel.name || 'New Label',
              category: currentLabel.category || 'General',
              description: currentLabel.description || '',
              creationDate: new Date().toISOString().split('T')[0]
          };
          setLabels([...labels, newLabel]);
      }
      setIsLabelModalOpen(false);
      setCurrentLabel({});
  };


  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return (
          <div className="flex flex-col gap-2 animate-fade-in max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-5">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Support Dashboard</h2>
              <p className="text-gray-500">
                Select your main to access your student management dashboard
              </p>
            </div>

            {/* Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {units.map((unit) => (
                <div key={unit.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
                  {/* Card Header: Icon & Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-100 shadow-lg">
                      <Package size={20} strokeWidth={2} />
                    </div>
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                      {unit.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{unit.title}</h3>
                    <p className="text-xs text-gray-400">{unit.subtitle}</p>
                  </div>

                  {/* Groups Row */}
                  <div className="flex justify-between items-end mb-2 mt-auto">
                    <span className="text-xs font-semibold text-gray-700">Groups</span>
                    <span className="text-[10px] text-gray-400">2 groups</span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-9 mb-5 border-t border-gray-40 pt-4">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-blue-600">{unit.students}</span>
                      <span className="text-[10px] text-gray-500 font-medium">Students</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-red-500">{unit.outside}</span>
                      <span className="text-[10px] text-gray-500 font-medium">Outside</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-green-600">{unit.availableCapacity}</span>
                      <span className="text-[10px] text-gray-500 font-medium">Available Capacity</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-yellow-500">{unit.reminders}</span>
                      <span className="text-[10px] text-gray-500 font-medium">Reminders</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => onUnitSelect && onUnitSelect({ id: unit.id, title: unit.title })}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
                  >
                    Student List
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom Section: Reminders */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mt-2">
               <h3 className="text-lg font-bold text-gray-900 mb-6">Upcoming Actions & Reminders</h3>
               
               {reminders.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-6">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                     <CheckCircle2 size={24} />
                   </div>
                   <h4 className="text-sm font-bold text-gray-900 mb-1">No Pending Reminders</h4>
                   <p className="text-sm text-gray-500 mb-4 text-center">
                     You're all caught up! There are no pending actions or reminders at this time.
                   </p>
                   <p className="text-[10px] text-gray-400">
                     (Students loaded: {units.reduce((acc, u) => acc + u.students, 0)}, Mains: {units.length})
                   </p>
                 </div>
               ) : (
                 <div className="space-y-3">
                   {reminders.map((reminder) => (
                     <div 
                       key={reminder.id}
                       className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-4"
                     >
                       {/* Left side: Description and Tags */}
                       <div className="flex-1 min-w-0">
                         <div className="mb-2">
                           <span className="text-sm text-gray-900 font-medium">{reminder.description}</span>
                         </div>
                         
                         {/* Tags */}
                         <div className="flex items-center gap-2 flex-wrap">
                           <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md whitespace-nowrap">
                             {reminder.personName}
                           </span>
                           <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-md whitespace-nowrap">
                             {reminder.group}
                           </span>
                           <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md whitespace-nowrap">
                             {reminder.unit}
                           </span>
                           <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md whitespace-nowrap">
                             {reminder.status}
                           </span>
                         </div>
                       </div>

                       {/* Right side: Date, Status Indicator, and Action Icons */}
                       <div className="flex items-center gap-4 flex-shrink-0">
                         <div className="flex flex-col items-end">
                           <span className="text-sm text-gray-700 font-medium whitespace-nowrap">{reminder.dueDate}</span>
                           <span className="text-xs text-gray-500 whitespace-nowrap">{reminder.statusIndicator}</span>
                         </div>
                         
                         {/* Action Icons */}
                         <div className="flex items-center gap-1">
                           <button
                             onClick={() => handleCompleteReminder(reminder.id)}
                             className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                             title="Complete"
                           >
                             <Check size={18} />
                           </button>
                           <button
                             onClick={() => handleDismissReminder(reminder.id)}
                             className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                             title="Dismiss"
                           >
                             <X size={18} />
                           </button>
                           <button
                             onClick={() => handleViewStudent(reminder)}
                             className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                             title="View Student"
                           >
                             <Eye size={18} />
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>
        );

      case 'units-list':
        return (
          <div className="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
             {/* Header */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">Units Overview</h2>
                   <p className="text-gray-500 mt-1">View unit statistics and manage admins and supervisors</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm whitespace-nowrap">
                   <RefreshCw size={18} />
                   <span className="font-medium text-sm">Sync Data</span>
                </button>
             </div>

             {/* Cards Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mainsList.map((main) => (
                  <div key={main.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
                      {/* Card Header */}
                      <div className="p-4 border-b border-gray-10">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{main.title}</h3>
                          <p className="text-xs text-gray-400 font-mono">ID: {main.id}</p>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col gap-6">
                          
                          {/* Key Metrics Row */}
                          <div className="grid grid-cols-4 gap-15 text-center">
                             <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-green-600">{main.active}</span>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">Active</span>
                             </div>
                             <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-rich-yellow-600">{main.outside}</span>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">outside</span>
                             </div>
                             <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-orange-500">{main.expired}</span>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">Expired</span>
                             </div>
                             <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-red-600">{main.lost}</span>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">Lost</span>
                             </div>
                          </div>

                          {/* Admin Info */}
                          <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-3">
                             <div className="w-9 h-9 p-1 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm">
                                <UserCog size={20} />
                             </div>
                             <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-gray-800 truncate">{main.adminName}</span>
                                <span className="text-xs text-gray-500 font-mono truncate">{main.adminPhone}</span>
                             </div>
                          </div>

                          {/* Detailed Stats */}
                          <div className="space-y-3">
                             <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                <span className="text-gray-600">Pending Tasks</span>
                                <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{main.pendingTasks}</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Average Progress</span>
                                <div className="flex items-center gap-2">
                                   <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-green-500 rounded-full" style={{width: `${main.avgProgress}%`}}></div>
                                   </div>
                                   <span className="font-bold text-green-600">{main.avgProgress}%</span>
                                </div>
                             </div>
                          </div>
                      </div>

                      {/* Footer Buttons */}
                      <div className="p-3 bg-gray-50 border-t border-gray-100 grid grid-cols-1 gap-2">
                          <button 
                             onClick={() => onUnitSelect && onUnitSelect({ id: main.id, title: main.title })}
                             className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                          >
                             View Student List
                          </button>
                          <button 
                            onClick={() => onUnitSelect && onUnitSelect({ id: main.id, title: main.title }, 'unit-settings')}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-white hover:border-gray-400 transition-all bg-white shadow-sm"
                          >
                            Unit Setting
                          </button>
                      </div>
                  </div>
                ))}
             </div>
          </div>
        );
        case 'unit-settings':
          // Find extended details if available
          const extendedUnit = mainsList.find(u => u.id === selectedUnit?.id);
          // Mock data if not found or for fields not in mainsList
          const unitDetails = {
              name: selectedUnit?.title || "junior-two-ahmed-hassan",
              id: selectedUnit?.id || "104",
              admin: extendedUnit?.adminName || "Ahmed Hassan", 
              supervisors: "Mona Ali, Sara Mahmoud", // Mock
              usedCapacity:90,
              remainingCapacity:2,
              totalCapacity:150 ,
              availableCapacity:70,
              totalGroups: 2,
              totalTasks: 4,
          };
  
          return (
            <div className="flex flex-col h-full animate-fade-in max-w-5xl mx-auto">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                      <Settings size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Unit Settings</h2>
              </div>
  
              {/* Navigation */}
              <button 
                  onClick={() => onUnitSelect && selectedUnit && onUnitSelect(selectedUnit, 'unit-student-list')}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 group w-fit"
              >
                  {/* Use a simple left arrow instead of ChevronLeft to fix the unresolved component error */}
                  <span className="group-hover:-translate-x-1 transition-transform inline-block">&larr;</span>
                  <span className="font-medium">Back to Unit</span>
              </button>
  
              {/* Content Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                 <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">General Information</h3>
                    <p className="text-sm text-gray-500 mt-1">View unit information</p>
                 </div>
                 
                 <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Unit Name</label>
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm">
                              {unitDetails.name}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Unit ID</label>
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm font-mono">
                              {unitDetails.id}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Admin</label>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                  <User size={14} />
                              </div>
                              <span className="text-gray-900 font-medium text-sm">{unitDetails.admin}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Supervisors</label>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                                  <Users size={14} />
                              </div>
                              <span className="text-gray-900 font-medium text-sm">{unitDetails.supervisors}</span>
                          </div>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="border-t border-gray-100 pt-6 mt-6">
                        <h4 className="text-sm font-bold text-gray-900 mb-4">Statistics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Capacity Section */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Students Capacity</label>
                                    <span className="text-sm font-bold text-gray-900">
                                    {unitDetails.usedCapacity} / {unitDetails.totalCapacity}
                                    </span>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 rounded-full transition-all" 
                                        style={{width: `${(unitDetails.usedCapacity / unitDetails.totalCapacity) * 100}%`}}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-600">
                                    <span>Available: {unitDetails.availableCapacity}</span>
                                    <span>Total Capacity: {unitDetails.totalCapacity}</span>
                                </div>
                            </div>

                            {/* Remaining Capacity */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Remaining Capacity</label>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <span className="text-2xl font-bold text-gray-900">{unitDetails.remainingCapacity}</span>
                                    <span className="text-sm text-gray-500 ml-2">students</span>
                                </div>
                            </div>

                            {/* Total Groups */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Groups</label>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <span className="text-2xl font-bold text-gray-900">{unitDetails.totalGroups}</span>
                                    <span className="text-sm text-gray-500 ml-2">groups</span>
                                </div>
                            </div>

                            {/* Total Tasks */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Tasks</label>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <span className="text-2xl font-bold text-gray-900">{unitDetails.totalTasks}</span>
                                    <span className="text-sm text-gray-500 ml-2">tasks</span>
                                </div>
                            </div>
                        </div>
                    </div>
  
                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 mt-8">
                        <div className="mt-0.5 text-blue-600">
                            {/* Use a simple info SVG icon instead of the missing Info component */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="none"
                                viewBox="0 0 20 20"
                                className="inline-block"
                            >
                                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                                <rect x="9" y="8" width="2" height="6" rx="1" fill="currentColor" />
                                <rect x="9" y="5" width="2" height="2" rx="1" fill="currentColor" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-blue-800 font-medium">To edit unit details, please go to Elkheta Backend.</p>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          );
      
      case 'admin-list':
        return (
          <div className="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
             {/* Header */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">Admin List</h2>
                   <p className="text-gray-500 mt-1">Manage administrator accounts and their units</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm whitespace-nowrap">
                   <RefreshCw size={18} />
                   <span className="font-medium text-sm">Sync Data</span>
                </button>
             </div>

             {/* Admin Table */}
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">NAME</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">PHONE NUMBER</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">EMAIL</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SUPERVISOR</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">LINKED UNITS</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50 transition-colors group">
                               <td className="px-6 py-4 text-sm text-gray-500 font-mono">{admin.id}</td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                     <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                        <User size={16} />
                                     </div>
                                     <span className="text-sm font-bold text-gray-900">{admin.name}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-sm text-gray-600">{admin.phone}</td>
                               <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                               <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                       <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-[10px] font-bold border border-purple-100">
                                           {admin.supervisor.charAt(0)}
                                       </div>
                                       <span className="text-sm text-gray-700">{admin.supervisor}</span>
                                   </div>
                               </td>
                               <td className="px-6 py-4">
                                  {admin.linkedUnits === "No units assigned" ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                          No units assigned
                                      </span>
                                  ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                          {admin.linkedUnits}
                                      </span>
                                  )}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                {admins.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No administrators found.
                    </div>
                )}
             </div>
          </div>
        );

      case 'supervisor-list':
          return (
            <div className="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
               {/* Header */}
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                     <h2 className="text-2xl font-bold text-gray-900">Supervisor List</h2>
                     <p className="text-gray-500 mt-1">Manage supervisor accounts and their linked units</p>
                  </div>
                  <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm whitespace-nowrap">
                     <RefreshCw size={18} />
                     <span className="font-medium text-sm">Sync Data</span>
                  </button>
               </div>
  
               {/* Supervisor Table */}
               <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</th>
                              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Linked Units</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {supervisors.map((supervisor) => (
                              <tr key={supervisor.id} className="hover:bg-gray-50 transition-colors group">
                                 <td className="px-6 py-4 text-sm text-gray-500 font-mono">{supervisor.id}</td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                                          <User size={16} />
                                       </div>
                                       <span className="text-sm font-bold text-gray-900">{supervisor.name}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-600">{supervisor.phone}</td>
                                 <td className="px-6 py-4 text-sm text-gray-600">{supervisor.email}</td>
                                 <td className="px-6 py-4">
                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {supervisor.grade}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    {supervisor.linkedUnits === "No units assigned" ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                            No units assigned
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {supervisor.linkedUnits}
                                        </span>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  {supervisors.length === 0 && (
                      <div className="p-8 text-center text-gray-500">
                          No supervisors found.
                      </div>
                  )}
               </div>
            </div>
          );

      case 'labels':
        return (
          <div className="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Labels</h2>
                <p className="text-gray-500 mt-1">Manage labels and their assigned categories</p>
              </div>
              <button 
                onClick={() => { setCurrentLabel({}); setIsLabelModalOpen(true); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <PlusCircle size={18} />
                <span className="font-medium text-sm">Add New Label</span>
              </button>
            </div>

            {/* Labels Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Label Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Linked Category</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creation Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {labels.map((label) => (
                      <tr key={label.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{label.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                              <Tag size={14} />
                            </div>
                            <span className="text-sm font-bold text-gray-900">{label.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {label.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{label.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{label.creationDate}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => handleEditLabel(label)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button 
                                onClick={() => handleDeleteLabel(label.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {labels.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No labels found.
                </div>
              )}
            </div>

            {/* Label Modal */}
            {isLabelModalOpen && (
              <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-lg text-gray-900">{currentLabel.id ? 'Edit Label' : 'Add New Label'}</h3>
                    <button 
                      onClick={() => setIsLabelModalOpen(false)}
                      className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label Name</label>
                      <input 
                        type="text" 
                        value={currentLabel.name || ''} 
                        onChange={(e) => setCurrentLabel({...currentLabel, name: e.target.value})}
                        placeholder="e.g. VIP, Urgent" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Linked Category</label>
                      <div className="relative">
                        <select 
                            value={currentLabel.category || ''}
                            onChange={(e) => setCurrentLabel({...currentLabel, category: e.target.value})}
                            className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="Status">Status</option>
                            <option value="Behavior">Behavior</option>
                            <option value="Academic">Academic</option>
                            <option value="General">General</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        value={currentLabel.description || ''}
                        onChange={(e) => setCurrentLabel({...currentLabel, description: e.target.value})}
                        placeholder="Describe the purpose of this label..." 
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none text-gray-700 bg-white"
                      ></textarea>
                    </div>
                  </div>
                  <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button 
                      onClick={() => setIsLabelModalOpen(false)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveLabel}
                      disabled={!currentLabel.name || !currentLabel.category}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Label
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'task-list':
      case 'unit-tasks':
        return (
          <div className="flex flex-col h-full animate-fade-in max-w-[1600px] mx-auto pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <ListTodo size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Field */}
                    <div className="relative flex-1 md:w-64">
                       <input 
                          type="text" 
                          placeholder="Search tasks..." 
                          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                       />
                       <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    <button 
                        onClick={() => {
                          if (onTabChange) {
                            onTabChange('add-task');
                          } else if (onUnitSelect && selectedUnit) {
                            onUnitSelect(selectedUnit, 'add-task');
                          }
                        }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
                    >
                        <PlusCircle size={18} />
                        <span className="font-medium text-sm">Add Task</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-center">
               
               {/* Visibility Filter */}
               <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">Visibility:</label>
                  <div className="relative">
                     <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer hover:bg-gray-100 transition-colors">
                        <option>Visible</option>
                        <option>All</option>
                        <option>Hidden</option>
                     </select>
                     <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
               </div>

               {/* Status Filter */}
               <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">Status:</label>
                  <div className="relative">
                     <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer hover:bg-gray-100 transition-colors">
                        <option>All</option>
                        <option>Active</option>
                        <option>Expired</option>
                     </select>
                     <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
               </div>

               {/* Start Date Filter (Multi-select) */}
               <div className="flex items-center gap-2 relative">
                  <label className="text-sm font-medium text-gray-600">Start Date:</label>
                  <button 
                    onClick={() => setIsStartDateFilterOpen(!isStartDateFilterOpen)}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>3 months selected</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {isStartDateFilterOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in-down">
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase">Select months</h4>
                        </div>
                        <div className="p-2 max-h-48 overflow-y-auto scrollbar-thin">
                            {['Dec 2025', 'Nov 2025', 'Oct 2025', 'Sep 2025'].map((month) => (
                                <label key={month} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-700">{month}</span>
                                </label>
                            ))}
                        </div>
                        <div className="p-2 border-t border-gray-100 bg-gray-50 flex justify-between">
                            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700">Select All</button>
                            <button className="text-[10px] font-bold text-gray-500 hover:text-gray-700">Clear All</button>
                        </div>
                    </div>
                  )}
               </div>

               <div className="ml-auto text-xs text-gray-500">
                  Showing {tasks.length} of {tasks.length} tasks
               </div>
            </div>
            
            {/* Tasks Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1500px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Task Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Assigned Group Numbers</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Report</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiration Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Visibility</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">{task.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                                            {task.assignedGroups}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 w-24">
                                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                                                <span>{task.progressCount}/{task.progressTotal}</span>
                                                <span>{task.progressPercent}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full" 
                                                    style={{ width: `${task.progressPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                     <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 w-24">
                                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                                                <span>{task.reportAvailable}/{task.reportAvailable}</span>
                                                <span>{task.reportAvailable}%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        {task.startDate}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        {task.expirationDate}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={task.description}>
                                        {task.description}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${task.visibility === 'visible' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {task.visibility === 'visible' ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {task.visibility === 'visible' ? 'Visible' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 text-xs font-bold">
                                            <button className="text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                                            <button className="text-green-600 hover:text-green-800 transition-colors">Clone</button>
                                            <button className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        );

      case 'add-task':
        return (
          <div className="flex flex-col h-full animate-fade-in max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="mb-4">
              <button 
                onClick={() => {
                  if (onTabChange) {
                    onTabChange('task-list');
                  } else if (onUnitSelect && selectedUnit) {
                    onUnitSelect(selectedUnit, 'unit-tasks');
                  }
                }}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 group w-fit"
              >
                <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-sm">Back to Tasks</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-900">+ Add New Task</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Task Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Enter task name" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        rows={2} 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-700" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date <span className="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-700" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade Assignment */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Grade Assignment</h3>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Grades <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2 mb-4">
                    <input 
                      type="checkbox" 
                      id="selectAllGrades" 
                      checked={allGradesSelected}
                      onChange={(e) => handleSelectAllGrades(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <label htmlFor="selectAllGrades" className="text-sm text-gray-600 font-medium cursor-pointer select-none">Select All Grades</label>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {grades.map(grade => (
                    <div key={grade.id} className="border border-gray-200 rounded-lg p-3">
                      {/* Grade Header */}
                      <label className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isGradeSelected(grade.id)}
                          onChange={(e) => handleSelectGrade(grade.id, e.target.checked)}
                          className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-bold text-gray-900">{grade.name}</span>
                      </label>
                      
                      {/* Units under Grade */}
                      <div className="ml-3 space-y-1 ">
                        {grade.units.map(unit => (
                          <label key={unit.id} className="flex items-center gap-2 p-1 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input 
                              type="checkbox" 
                              checked={selectedUnits.has(unit.id)}
                              onChange={(e) => handleUnitToggle(unit.id, e.target.checked)}
                              className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">{unit.name} <span className="text-gray-400 text-xs">({unit.students} students)</span></span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-600 font-medium mt-2">
                  {selectedUnits.size} unit(s) selected - {totalSelectedStudents} students total
                </p>
              </div>

              {/* Label Assignment */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Label Assignment</h3>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Labels</label>
                  <div className="flex items-center gap-2 mb-4">
                    <input 
                      type="checkbox" 
                      id="selectAllLabels" 
                      checked={allLabelsSelected}
                      onChange={(e) => handleSelectAllLabels(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <label htmlFor="selectAllLabels" className="text-sm text-gray-600 font-medium cursor-pointer select-none">Select All Labels</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-3 mb-2">
                  {taskLabels.map(label => (
                    <label key={label.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedLabels.has(label.id)}
                        onChange={(e) => handleLabelToggle(label.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-sm text-gray-700">{label.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-blue-600 font-medium">
                  {selectedLabels.size} label(s) selected
                </p>
              </div>

              {/* Student Assignment */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Student Assignment</h3>
                <div className="flex gap-6 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="assignmentMethod" 
                      checked={assignmentMethod === 'all'} 
                      onChange={() => setAssignmentMethod('all')} 
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                    />
                    <span className="text-sm text-gray-700 font-medium">All Students in Selected Groups</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="assignmentMethod" 
                      checked={assignmentMethod === 'conditions'} 
                      onChange={() => setAssignmentMethod('conditions')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                    />
                    <span className="text-sm text-gray-700 font-medium">Based on Conditions</span>
                  </label>
                </div>

                {/* Assignment Conditions */}
                {assignmentMethod === 'conditions' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Assignment Conditions</h4>
                    
                    {/* Progress Filter */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={progressFilterEnabled}
                          onChange={(e) => setProgressFilterEnabled(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-medium text-gray-700">Progress Filter</span>
                      </label>
                      {progressFilterEnabled && (
                        <div className="flex items-center gap-3 ml-6">
                          <input 
                            type="number" 
                            value={progressFrom}
                            onChange={(e) => setProgressFrom(Number(e.target.value))}
                            placeholder="From" 
                            className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                          />
                          <span className="text-gray-500">to</span>
                          <input 
                            type="number" 
                            value={progressTo}
                            onChange={(e) => setProgressTo(Number(e.target.value))}
                            placeholder="To" 
                            className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Diamonds Filter */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={diamondsFilterEnabled}
                          onChange={(e) => setDiamondsFilterEnabled(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-medium text-gray-700">Diamonds Filter</span>
                      </label>
                      {diamondsFilterEnabled && (
                        <div className="flex items-center gap-3 ml-6">
                          <input 
                            type="number" 
                            value={diamondsFrom}
                            onChange={(e) => setDiamondsFrom(Number(e.target.value))}
                            placeholder="From" 
                            className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                          />
                          <span className="text-gray-500">to</span>
                          <input 
                            type="number" 
                            value={diamondsTo}
                            onChange={(e) => setDiamondsTo(Number(e.target.value))}
                            placeholder="To" 
                            className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Accumulated Lessons Filter */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={lessonsFilterEnabled}
                          onChange={(e) => setLessonsFilterEnabled(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-medium text-gray-700">Accumulated Lessons Filter</span>
                      </label>
                      {lessonsFilterEnabled && (
                        <div className="flex items-center gap-3 ml-6">
                          <input 
                            type="number" 
                            value={lessonsFrom}
                            onChange={(e) => setLessonsFrom(Number(e.target.value))}
                            placeholder="From" 
                            className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                          />
                          <span className="text-gray-500">to</span>
                          <input 
                            type="number" 
                            value={lessonsTo}
                            onChange={(e) => setLessonsTo(Number(e.target.value))}
                            placeholder="To" 
                            className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Last Seen on Site Filter */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={lastSeenSiteFilterEnabled}
                          onChange={(e) => setLastSeenSiteFilterEnabled(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-medium text-gray-700">Last Seen on Site Filter</span>
                      </label>
                      {lastSeenSiteFilterEnabled && (
                        <div className="ml-6">
                          <input 
                            type="number" 
                            value={lastSeenSiteDays}
                            onChange={(e) => setLastSeenSiteDays(Number(e.target.value))}
                            placeholder="Within last X days" 
                            className="w-48 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                          />
                          <span className="text-xs text-gray-500 ml-2">days</span>
                        </div>
                      )}
                    </div>

                    {/* Last Seen on Chat Filter */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={lastSeenChatFilterEnabled}
                          onChange={(e) => setLastSeenChatFilterEnabled(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-medium text-gray-700">Last Seen on Chat Filter</span>
                      </label>
                      {lastSeenChatFilterEnabled && (
                        <div className="ml-6">
                          <input 
                            type="number" 
                            value={lastSeenChatDays}
                            onChange={(e) => setLastSeenChatDays(Number(e.target.value))}
                            placeholder="Within last X days" 
                            className="w-48 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
                          />
                          <span className="text-xs text-gray-500 ml-2">days</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => {
                    if (onTabChange) {
                      onTabChange('task-list');
                    } else if (onUnitSelect && selectedUnit) {
                      onUnitSelect(selectedUnit, 'unit-tasks');
                    }
                  }}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // TODO: Handle task creation
                    console.log('Create task', { taskName, startDate, expirationDate, description, selectedUnits, selectedLabels, assignmentMethod });
                    if (onTabChange) {
                      onTabChange('task-list');
                    } else if (onUnitSelect && selectedUnit) {
                      onUnitSelect(selectedUnit, 'unit-tasks');
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        );

      case 'unit-student-list':
        return (
          <div className="flex flex-col h-full animate-fade-in pb-12 relative">
            {/* Header for Student List (Title only) */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Student List</h2>
                <p className="text-gray-500">Manage students for <span className="font-semibold text-gray-700">{selectedUnit?.title}</span></p>
            </div>

            {/* Search Bar - Google Drive Style */}
            <div className="w-full max-w-4xl mb-6">
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Search className="text-gray-500 group-focus-within:text-blue-600 transition-colors" size={20} />
                  </div>
                  <input 
                     type="text" 
                     placeholder="Search by name or number" 
                     className="w-full pl-10 pr-12 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                     <button className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors" title="Filter options">
                        <Search size={16} />
                     </button>
                  </div>
               </div>
            </div>

            {/* NEW Toolbar / Filter Bar */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    {/* Left Side: Filters and Icons */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        {/* Select All Checkbox */}
                        <div className="flex items-center gap-2 mr-2 bg-white px-3 py-2 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-50" />
                            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Select all</span>
                        </div>

                        {/* Sort Dropdown Container */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${isSortMenuOpen ? 'border-blue-400 ring-2 ring-blue-100 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50 bg-white'} shadow-sm`}
                                title="Sort Students"
                            >
                                <Eye size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {isSortMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 animate-fade-in-down">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Sort Students By:</h4>
                                    
                                    <div className="space-y-4">
                                        {/* Progress */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-700 block mb-1.5">Progress</label>
                                            <div className="flex gap-2">
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">High to Low</button>
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Low to High</button>
                                            </div>
                                        </div>

                                        {/* Diamonds */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-700 block mb-1.5">Diamonds</label>
                                            <div className="flex gap-2">
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">High to Low</button>
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Low to High</button>
                                            </div>
                                        </div>

                                        {/* Last Seen on Site */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-700 block mb-1.5">Last Seen on Site</label>
                                            <div className="flex gap-2">
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Most Recent</button>
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Oldest</button>
                                            </div>
                                        </div>

                                        {/* Last Chat */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-700 block mb-1.5">Last Chat</label>
                                            <div className="flex gap-2">
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Most Recent</button>
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Oldest</button>
                                            </div>
                                        </div>

                                        {/* Num of Tasks */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-700 block mb-1.5">Num of Tasks</label>
                                            <div className="flex gap-2">
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Most Tasks</button>
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Fewest Tasks</button>
                                            </div>
                                        </div>
                                        
                                        {/* Date Added */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-700 block mb-1.5">Date Added</label>
                                            <div className="flex gap-2">
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-blue-200 bg-blue-50 text-blue-600 rounded transition-colors">Newest First</button>
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Oldest First</button>
                                            </div>
                                        </div>

                                        {/* Expiration Date */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-700 block mb-1.5">Expiration Date</label>
                                            <div className="flex gap-2">
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Newest Expired</button>
                                                <button className="flex-1 px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">Oldest Expired</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* All Subjects Dropdown */}
                        <div className="relative">
                            <button className="h-10 px-4 flex items-center gap-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white text-sm font-medium shadow-sm whitespace-nowrap">
                                <span>All Subjects</span>
                                <ChevronDown size={16} />
                            </button>
                        </div>

                        {/* Icon Actions */}
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-cyan-500 hover:bg-gray-50 bg-white shadow-sm" title="Diamonds Filter">
                                <Gem size={18} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-green-500 hover:bg-gray-50 bg-white shadow-sm" title="Progress Filter">
                                <BarChart2 size={18} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-purple-500 hover:bg-gray-50 bg-white shadow-sm" title="Lessons Filter">
                                <BookOpen size={18} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-blue-500 hover:bg-gray-50 bg-white shadow-sm" title="Last Seen Filter">
                                <MessageCircle size={18} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-purple-600 hover:bg-gray-50 bg-white shadow-sm" title="Device Filter">
                                <Monitor size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Status and Tasks */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Toggle */}
                        <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                            <button className="px-4 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-md transition-all">Show All</button>
                            <button className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-all">Done</button>
                            <button className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-all">To Do</button>
                        </div>
                        
                        {/* Tasks Dropdown */}
                        <button className="h-10 px-4 flex items-center gap-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white text-sm font-medium shadow-sm">
                            <span>Tasks</span>
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Student List (Card Style) */}
            <div className="flex flex-col gap-3">
              {students.map((student) => (
                <div key={student.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-all">
                    {/* Left: Checkbox & Message Icon */}
                    <div className="flex items-center gap-4">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-50" />
                        
                        <div className="flex flex-col items-center gap-1 min-w-[40px]">
                            <button className="w-9 h-9 rounded-full border border-green-200 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors">
                                <MessageCircle size={16} />
                            </button>
                            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{student.lastMessageTime}</span>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="flex flex-col w-48">
                        <button onClick={() => setSelectedStudent(student)} className="text-left font-bold text-gray-900 text-sm md:text-base hover:text-blue-600 transition-colors">{student.name}</button>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs md:text-sm text-gray-500 font-medium">{student.phone}</span>
                            <button className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                <X size={10} />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex-1 min-w-[200px] max-w-sm">
                        <div className="flex justify-between mb-1.5">
                            <span className="text-xs font-semibold text-gray-700">Average Progress</span>
                            <span className="text-xs font-bold text-green-600">{student.progress}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{width: `${student.progress}%`}}></div>
                        </div>
                    </div>

                    {/* Score Circle */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 border-gray-100 text-gray-400 shrink-0">
                        <span className="text-[10px] font-bold">0%</span>
                        <span className="text-[10px] leading-none">0</span>
                    </div>

                    {/* Diamonds */}
                    <div className="flex flex-col items-center gap-1 min-w-[60px] shrink-0">
                        <div className="flex items-center gap-1.5 text-cyan-500 font-bold">
                            <Gem size={18} fill="currentColor" className="text-cyan-500" />
                            <span className="text-sm">{student.diamonds}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                            <Monitor size={10} /> {student.lastSeen}
                        </span>
                    </div>

                    {/* Group Number Dropdown */}
                    <div className="relative mx-2 shrink-0">
                       <select 
                           onClick={(e) => e.stopPropagation()}
                           className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer hover:bg-white transition-colors h-10"
                       >
                         <option>Outside</option>
                         <option>G1</option>
                         <option>G2</option>
                         <option>G3</option>
                         <option>G4</option>
                         <option>G5</option>
                       </select>
                       <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Notes Trigger Button */}
                    <div className="flex items-center justify-center shrink-0">
                        <button 
                            onClick={(e) => openNotesModal(e, student)}
                            className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-100 flex items-center justify-center transition-colors shadow-sm"
                            title="Notes & Reminders"
                        >
                            <StickyNote size={18} />
                        </button>
                    </div>

                    {/* Spacer (desktop only) */}
                    <div className="hidden md:block flex-1"></div>

                    {/* Status Tags */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-semibold border border-gray-200">
                            {student.status}
                        </span>
                        {student.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-semibold border border-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
              ))}
              
              <div className="text-center mt-6">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                    Load More Students
                </button>
              </div>
            </div>

            {/* Student Notes Modal */}
            {isNotesModalOpen && currentNotesStudent && (
              <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center backdrop-blur-sm p-4 animate-fade-in">
                 <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                       <div>
                          <h3 className="font-bold text-lg text-gray-900">Notes & Activity</h3>
                          <p className="text-xs text-gray-500 mt-0.5">For <span className="font-semibold text-gray-700">{currentNotesStudent.name}</span></p>
                       </div>
                       <button 
                         onClick={() => setIsNotesModalOpen(false)}
                         className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                       >
                         <X size={20} />
                       </button>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200">
                        
                        {/* Add Note Section */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-800 mb-3">Add Note</h4>
                            <div className="flex gap-3 mb-3">
                                <input 
                                    type="date" 
                                    defaultValue="2025-11-30" 
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-700" 
                                />
                                <div className="flex-1 relative">
                                    <select className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option>Select Category</option>
                                        <option>General</option>
                                        <option>Academic</option>
                                        <option>Behavioral</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <textarea 
                                placeholder="Enter your note here..." 
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none text-gray-700 bg-white mb-3"
                            ></textarea>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm">
                                Add Note
                            </button>
                        </div>

                        {/* Add Reminder Section */}
                        <div className="mb-6 pt-2 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 mt-4">Add Reminder</h4>
                            <input 
                                type="text" 
                                placeholder="What needs to be done?" 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-gray-700 mb-3" 
                            />
                            
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <button className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">1 Day</button>
                                <button className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">2 Days</button>
                                <button className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">3 Days</button>
                                <button className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">7 Days</button>
                            </div>

                            <div className="mb-3">
                                {!showCustomDateInput ? (
                                    <button 
                                        onClick={() => setShowCustomDateInput(true)}
                                        className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        Custom Date
                                    </button>
                                ) : (
                                    <div className="relative animate-fade-in">
                                        <input 
                                            type="date" 
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-gray-700"
                                            autoFocus
                                        />
                                        <button 
                                            onClick={() => setShowCustomDateInput(false)}
                                            className="absolute right-10 top-2.5 text-xs text-gray-400 hover:text-gray-600 underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm opacity-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                Add Reminder
                            </button>
                        </div>

                        {/* History Tabs */}
                        <div className="flex items-center gap-2 mb-4 mt-6">
                            <button 
                                onClick={() => setActiveNoteTab('recent')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeNoteTab === 'recent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                <Clock size={14} />
                                <span>Recent</span>
                            </button>
                            <button 
                                onClick={() => setActiveNoteTab('archived')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeNoteTab === 'archived' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                <Archive size={14} />
                                <span>Archived</span>
                            </button>
                            <button 
                                onClick={() => setActiveNoteTab('notes')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeNoteTab === 'notes' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                <StickyNote size={14} />
                                <span>Notes</span>
                            </button>
                        </div>

                        {/* Notes Timeline */}
                        <div className="space-y-4">
                           {/* Render mock notes */}
                           {mockNotes.map((note) => (
                             <div key={note.id} className="relative pl-4 border-l-2 border-gray-100">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${note.type === 'reminder' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
                                <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                   <div className="flex justify-between items-start mb-1">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${note.type === 'reminder' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                         {note.type === 'reminder' ? 'Reminder' : 'Note'}
                                      </span>
                                      <span className="text-[10px] text-gray-400">{note.date}</span>
                                   </div>
                                   <p className="text-sm text-gray-700 mb-1">{note.text}</p>
                                   <div className="text-[10px] text-gray-400 font-medium text-right">Added by: {note.author}</div>
                                </div>
                             </div>
                           ))}
                           
                           <div className="text-center py-2">
                              <span className="text-[10px] text-gray-300 uppercase tracking-widest">End of History</span>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Student Profile Sidebar */}
            {selectedStudent && (
              <>
                <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col h-full overflow-hidden animate-slide-in-right">
                  {/* Sidebar Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedStudent.name}</h3>
                      <p className="text-xs text-gray-500">Student Profile</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                        Save
                      </button>
                      <button 
                        onClick={() => setSelectedStudent(null)}
                        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Sidebar Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                    
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-800 text-sm">Personal Information</h4>
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded border border-green-100 uppercase tracking-wide">
                          Active (39 Days to expire)
                        </span>
                      </div>
                      
                      <div className="flex gap-3 mb-3">
                        <input type="text" defaultValue={selectedStudent.firstName} placeholder="First Name" className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50" />
                        <input type="text" defaultValue={selectedStudent.lastName} placeholder="Last Name" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50" />
                      </div>

                      <div className="flex gap-2 mb-3">
                        <div className="flex-1 relative">
                          <input type="text" defaultValue={selectedStudent.phone} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50" />
                          <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">(Account)</span>
                        </div>
                        <button className="w-9 h-9 bg-green-50 text-green-600 border border-green-100 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors">
                          <MessageCircle size={18} />
                        </button>
                        <button className="w-9 h-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="mb-4">
                         <input type="email" placeholder="Email Address" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 italic focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50" />
                      </div>

                    {/* More Data (Collapsible) */}
                    <CollapsibleSection title="More Data" defaultOpen={true}>
                       <div className="space-y-3 pt-1">
                          <div>
                             <label className="text-xs text-gray-500 font-medium block mb-1">Governorate</label>
                             <div className="relative">
                                <select className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50">
                                   <option>اختر المحافظة</option>
                                   <option>Cairo</option>
                                   <option>Giza</option>
                                   <option>Alexandria</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                             </div>
                          </div>
                          <div>
                             <label className="text-xs text-gray-500 font-medium block mb-1">Hobbies</label>
                             <div className="relative">
                                <select className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50">
                                   <option>Select hobbies</option>
                                   <option>Reading</option>
                                   <option>Sports</option>
                                   <option>Coding</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                             </div>
                          </div>
                          <div>
                             <label className="text-xs text-gray-500 font-medium block mb-1">Weakest Subjects</label>
                             <div className="relative">
                                <select className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50">
                                   <option>Select weakest subjects</option>
                                   <option>Math</option>
                                   <option>Physics</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                             </div>
                          </div>
                          <div>
                             <label className="text-xs text-gray-500 font-medium block mb-1">Preferred Subjects</label>
                             <div className="relative">
                                <select className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50">
                                   <option>Select preferred subjects</option>
                                   <option>History</option>
                                   <option>Biology</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                             </div>
                          </div>
                       </div>
                    </CollapsibleSection>
                    

                      {/* Label Dropdown */}
                      <div className="mb-4">
                        <label className="text-xs text-gray-500 font-medium block mb-1.5 ml-1">Label</label>
                        <div className="relative">
                           <select className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50">
                              <option>Select Label</option>
                              <option>Vip</option>
                              <option>New</option>
                              <option>Warning</option>
                           </select>
                           <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Special Notes */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                       <h4 className="font-bold text-gray-800 text-sm mb-3">Special Notes</h4>
                       <textarea 
                          placeholder="Add special notes about this student..." 
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 min-h-[80px] resize-y text-gray-600 bg-gray-50"
                       ></textarea>
                    </div>

                    {/* Parent Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                       <h4 className="font-bold text-gray-800 text-sm mb-4">Parent Info</h4>
                       <div className="space-y-3">
                          <input type="text" placeholder="Parent Name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 italic focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50" />
                          <div className="font-semibold text-gray-800 px-1">{selectedStudent.phone}</div>
                          
                          <div className="pt-2">
                            <label className="text-xs font-semibold text-gray-600 mb-2 block">Parent Notes</label>
                            <textarea 
                              placeholder="Add notes about this parent..." 
                              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 min-h-[80px] resize-y text-gray-600 bg-gray-50"
                            ></textarea>
                          </div>
                       </div>

                       <div className="flex flex-col gap-2 mt-4">
                          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm shadow-green-100">
                             Contact via WhatsApp
                          </button>
                          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm shadow-orange-100">
                             Reset Password
                          </button>
                       </div>
                    </div>

                    {/* Educational Information (Collapsible) */}
                    <CollapsibleSection title="Educational Information" defaultOpen={true}>
                       <div className="space-y-3 pt-1">
                          <input type="text" readOnly value="الأول الثانوى لغات" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 bg-gray-50 focus:outline-none" />
                          <input type="text" readOnly value="French" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 bg-gray-50 focus:outline-none" />
                          <input type="text" readOnly value="التربية الدينية الإسلامية" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 bg-gray-50 focus:outline-none" />
                       </div>
                    </CollapsibleSection>

                    {/* Technical Information (Collapsible) - Moved from Personal Information */}
                    <CollapsibleSection title="Technical Information" defaultOpen={false}>
                        <div className="space-y-3 pt-1">
                            <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-gray-500">Contact ID</span>
                                <span className="text-[10px] text-gray-400">From Latest Message</span>
                            </div>
                            <div className="text-sm text-gray-400 italic">Not available</div>
                            </div>

                            <div className="flex gap-3">
                            <div className="flex-1 border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                                <span className="text-xs font-medium text-gray-500 block mb-1">Conversation ID</span>
                                <div className="text-sm text-gray-400 italic">Not available</div>
                            </div>
                            <div className="flex-1 border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                                <span className="text-xs font-medium text-gray-500 block mb-1">Inbox ID</span>
                                <div className="text-sm text-gray-400 italic">Not available</div>
                            </div>
                            </div>
                            
                            <div className="border border-gray-100 rounded-lg p-3 bg-white flex justify-between items-center">
                                <div>
                                <span className="text-[10px] font-medium text-gray-500 block">Last Seen on Site</span>
                                <span className="text-xs text-gray-400">11/24/2025, 11:51:23 AM</span>
                                </div>
                                <span className="text-xs font-medium text-orange-500 flex items-center gap-1">
                                <Monitor size={12} /> 3d ago
                                </span>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Student Orders */}
                    <div className="pt-2">
                       <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-gray-900 text-sm">Student Orders</h4>
                          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">1 orders</span>
                       </div>
                       
                       <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                             <div>
                                <h5 className="text-sm font-bold text-gray-900">Grade 9 Complete</h5>
                                <p className="text-[10px] text-gray-500 mt-0.5">Sep 5, 2025 - Expires: Jan 5, 2026</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">1 month left</p>
                             </div>
                             <div className="text-right">
                                <span className="block text-sm font-bold text-gray-900 mb-1">179</span>
                                <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">active</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    {/* Bottom Padding */}
                    <div className="h-10"></div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'unit-messages':
        return (
          <div className="flex flex-col h-full animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <Send size={18} />
                    <span>New Broadcast</span>
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Package size={32} />
               </div>
               <h3 className="text-lg font-medium text-gray-900">Message Center</h3>
               <p className="text-gray-500 mt-2 max-w-md">Communicate with students and parents of {selectedUnit?.title} directly from here.</p>
            </div>
          </div>
        );

      case 'unit-settings':
        return (
          <div className="flex flex-col h-full animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Unit Settings</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="border-b border-gray-100 pb-4 mb-4">
                  <h3 className="text-lg font-medium text-gray-900">General Information</h3>
                  <p className="text-sm text-gray-500">Update unit details and configurations.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Name</label>
                    <input type="text" defaultValue={selectedUnit?.title} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input type="number" placeholder="Enter capacity" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" />
                  </div>
               </div>
               <div className="mt-6 flex justify-end">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
               </div>
            </div>
          </div>
        );
      
      case 'unit-follow-up':
      case 'unit-templates':
          return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-fade-in">
               <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <Settings size={32} />
               </div>
               <h2 className="text-xl font-bold text-gray-900">Coming Soon</h2>
               <p className="text-gray-500 mt-2">The {(activeTab as string).replace('unit-', '').replace('-', ' ')} module is currently under development.</p>
            </div>
          );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
             <h2 className="text-2xl font-bold text-gray-300">Section Under Construction</h2>
             <p className="text-gray-400 mt-2">The {(activeTab as string).replace('-', ' ')} view is being updated.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default DashboardView;