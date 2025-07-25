export const translations = {
  vi: {
    // Navigation
    nav: {
      home: "Trang chủ",
      competitions: "Cuộc thi",
      leaderboard: "Bảng xếp hạng",
      community: "Cộng đồng",
      docs: "Tài liệu",
      login: "Đăng nhập",
      register: "Đăng ký",
      profile: "Hồ sơ",
      logout: "Đăng xuất"
    },
    // Hero section
    hero: {
      title: "Nền tảng cuộc thi AI hàng đầu Việt Nam",
      subtitle: "Kết nối cộng đồng AI Việt Nam và quốc tế thông qua các cuộc thi thực tế, phát triển kỹ năng và giành những giải thưởng hấp dẫn.",
      startCompeting: "Bắt đầu thi đấu",
      watchDemo: "Xem demo"
    },
    // Competitions
    competitions: {
      featured: "Cuộc thi nổi bật",
      subtitle: "Khám phá những cuộc thi AI thú vị đang diễn ra",
      all: "Tất cả",
      computerVision: "Computer Vision",
      nlp: "NLP",
      tabular: "Tabular",
      joinNow: "Tham gia ngay",
      viewAll: "Xem tất cả cuộc thi",
      prize: "Giải thưởng",
      teams: "đội",
      daysLeft: "ngày"
    },
    // Auth
    auth: {
      loginTitle: "Đăng nhập vào VieMind",
      registerTitle: "Tạo tài khoản VieMind",
      email: "Email",
      password: "Mật khẩu",
      username: "Tên đăng nhập",
      fullName: "Họ và tên",
      loginButton: "Đăng nhập",
      registerButton: "Đăng ký",
      noAccount: "Chưa có tài khoản?",
      hasAccount: "Đã có tài khoản?",
      forgotPassword: "Quên mật khẩu?"
    },
    // Common
    common: {
      loading: "Đang tải...",
      error: "Có lỗi xảy ra",
      submit: "Gửi",
      cancel: "Hủy",
      save: "Lưu",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      search: "Tìm kiếm"
    }
  },
  en: {
    // Navigation
    nav: {
      home: "Home",
      competitions: "Competitions",
      leaderboard: "Leaderboard",
      community: "Community",
      docs: "Docs",
      login: "Login",
      register: "Register",
      profile: "Profile",
      logout: "Logout"
    },
    // Hero section
    hero: {
      title: "Vietnam's Leading AI Competition Platform",
      subtitle: "Connect Vietnamese and international AI communities through real competitions, develop skills and win exciting prizes.",
      startCompeting: "Start Competing",
      watchDemo: "Watch Demo"
    },
    // Competitions
    competitions: {
      featured: "Featured Competitions",
      subtitle: "Discover exciting AI competitions happening now",
      all: "All",
      computerVision: "Computer Vision",
      nlp: "NLP",
      tabular: "Tabular",
      joinNow: "Join Now",
      viewAll: "View All Competitions",
      prize: "Prize",
      teams: "teams",
      daysLeft: "days"
    },
    // Auth
    auth: {
      loginTitle: "Login to VieMind",
      registerTitle: "Create VieMind Account",
      email: "Email",
      password: "Password",
      username: "Username",
      fullName: "Full Name",
      loginButton: "Login",
      registerButton: "Register",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      forgotPassword: "Forgot password?"
    },
    // Common
    common: {
      loading: "Loading...",
      error: "An error occurred",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      search: "Search"
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.vi;
