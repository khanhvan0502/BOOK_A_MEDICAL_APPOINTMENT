export const adminMenu = [
  {
    // Quản lý
    name: "menu.admin.manage",
    menus: [
      // {
      //   name: "menu.admin.crud",
      //   link: "/system/user-manage",
      // },
      {
        name: "menu.admin.manage-user",
        link: "/system/user-redux",
      },
      {
        name: "menu.admin.manage-doctor",
        link: "/system/manager-doctor",
      },
      {
        // Quản lý lịch sử bệnh nhân khám bệnh
        name: "menu.admin.history-patient",
        link: "/system/history-patient",
      },

      // {
      //   // Quản lý kế hoạch khám bệnh của bác sĩ
      //   name: "menu.doctor.manage-schedule",
      //   link: "/doctor/manage-schedule",
      // },
    ],
  },
  {
    // Quản lý phòng khám
    name: "menu.admin.clinic",
    menus: [
      {
        name: "menu.admin.manage-clinic",
        link: "/system/manage-clinic",
      },
    ],
  },
  {
    // Quản lý chuyên khoa
    name: "menu.admin.specialty",
    menus: [
      {
        name: "menu.admin.manage-specialty",
        link: "/system/manage-specialty",
      },
    ],
  },
  {
    // Quản lý bài đăng
    name: "menu.admin.handbook",
    menus: [
      {
        name: "menu.admin.manage-handbook",
        link: "/system/manage-handbook",
      },
    ],
  },
  {
    // Thống kê
    name: "menu.admin.statistical",
    menus: [
      {
        name: "menu.admin.manage-statistical",
        link: "/system/manage-statistical",
      },
    ],
  },
];

export const doctorMenu = [
  {
    name: "menu.admin.manage",
    menus: [
      {
        // Quản lý kế hoạch khám bệnh của bác sĩ
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      {
        // Quản lý bệnh nhân khám bệnh của bác sĩ
        name: "menu.doctor.manage-patient",
        link: "/doctor/manage-patient",
      },

      {
        // Quản lý thông tin cá nhân bác sĩ
        name: "menu.doctor.manage-infor",
        link: "/doctor/manage-information",
      },
    ],
  },
];
