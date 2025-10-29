export type RootStackParamList = {
  Splash: undefined;
  AuthStack: undefined;
  OnboardingStack: undefined;
  AppDrawer: undefined;
  MatchModal: { matchId: string } | undefined;
  ReportModal: { targetUserId: string } | undefined;
  PremiumModal: undefined;
  NotificationPreferences: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  AgeVerification: undefined;
  Login: undefined;
  Register: undefined;
  Verification: { contact: string };
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  ProfileSetup: undefined;
  OnboardingTutorial: undefined;
  PrivacyAgreement: undefined;
};

export type AppDrawerParamList = {
  MainTabs: undefined;
  SafetyCenter: undefined;
  SupportCenter: undefined;
};

export type MainTabParamList = {
  DiscoverStack: undefined;
  CirclesStack: undefined;
  CreateVibeStack: undefined;
  ConnectionsStack: undefined;
  ProfileStack: undefined;
};

export type DiscoverStackParamList = {
  DiscoverHome: undefined;
  MatchDetails: { matchId: string };
  DiscoveryFilters: undefined;
};

export type CirclesStackParamList = {
  CirclesHome: undefined;
  CircleDetail: { circleId: string };
  CreateCircle: undefined;
  CircleSettings: { circleId: string };
};

export type CreateVibeStackParamList = {
  CreatePrompt: undefined;
  RecordVibe: undefined;
  ReviewVibe: undefined;
  UploadProcessing: undefined;
};

export type ConnectionsStackParamList = {
  ConnectionsHome: undefined;
  ChatList: undefined;
  Chat: { conversationId: string };
  GroupChat: { circleId: string };
  ScheduledHangouts: undefined;
  FriendshipInsights: { userId: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Achievements: undefined;
  Settings: undefined;
  Notifications: undefined;
  Premium: undefined;
  Analytics: undefined;
};
