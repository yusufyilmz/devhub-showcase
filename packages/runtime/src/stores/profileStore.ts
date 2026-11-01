import { create } from "zustand";

type PrivateProfile = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  createdAt: number;
  updatedAt: number;
};

type PublicProfile = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  createdAt: number;
  updatedAt: number;
};

const GUEST_PROFILE: PrivateProfile = {
  avatar: "",
  createdAt: 0,
  email: "guest@example.com",
  id: 0,
  name: "Guest",
  updatedAt: 0,
};
// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ProfileState {
  clearProfiles: () => void;
  isGuest: boolean;
  // Profile data
  privateProfile: PrivateProfile;
  profiles: Record<string, PublicProfile>;
  reset: () => void;
  setGuestStatus: (isGuest: boolean) => void;

  // Computed getters

  // Actions
  setPrivateProfile: (profile: PrivateProfile) => void;
  setProfiles: (profiles: Record<string, PublicProfile>) => void;
  updatePrivateProfile: (updates: Partial<PrivateProfile>) => void;
  updateProfiles: (newProfiles: Record<string, PublicProfile>) => void;
}

// ============================================================================
// STORE CREATION
// ============================================================================

export const useProfileStore = create<ProfileState>()((set, get) => ({
  clearProfiles: () => {
    set({
      isGuest: true,
      privateProfile: GUEST_PROFILE,
      profiles: {},
    });
  },
  isGuest: true,
  // Initial state
  privateProfile: GUEST_PROFILE,
  profiles: {},

  reset: () => {
    set({
      isGuest: true,
      privateProfile: GUEST_PROFILE,
      profiles: {},
    });
  },

  setGuestStatus: (isGuest: boolean) => {
    set({ isGuest });
  },

  // Actions
  setPrivateProfile: (privateProfile: PrivateProfile) => {
    const newPrivateProfile = { ...get().privateProfile };

    set(() => ({
      privateProfile: newPrivateProfile,
    }));
  },

  setProfiles: (profiles: Record<string, PublicProfile>) => {
    set({ profiles });
  },

  updatePrivateProfile: (updates: Partial<PrivateProfile>) => {
    set(() => ({ privateProfile: { ...get().privateProfile, ...updates } }));
  },

  updateProfiles: (newProfiles: Record<string, PublicProfile>) => {
    const { profiles } = get();
    const updatedProfiles = { ...profiles, ...newProfiles };
    set({ profiles: updatedProfiles });
  },
}));

// ============================================================================
// ACTIONS OBJECT FOR EXTERNAL USE
// ============================================================================

export const profileActions = {
  clearProfiles: () => useProfileStore.getState().clearProfiles(),
  reset: () => useProfileStore.getState().reset(),
  setGuestStatus: (isGuest: boolean) => useProfileStore.getState().setGuestStatus(isGuest),
  setPrivateProfile: (profile: PrivateProfile) =>
    useProfileStore.getState().setPrivateProfile(profile),
  setProfiles: (profiles: Record<string, PublicProfile>) =>
    useProfileStore.getState().setProfiles(profiles),
  updatePrivateProfile: (updates: Partial<PrivateProfile>) =>
    useProfileStore.getState().updatePrivateProfile(updates),
  updateProfiles: (newProfiles: Record<string, PublicProfile>) =>
    useProfileStore.getState().updateProfiles(newProfiles),
};

// ============================================================================
// SELECTORS FOR OPTIMIZED RE-RENDERS
// ============================================================================

export const profileSelectors = {
  hasProfile: (state: ProfileState) => !!state.privateProfile,
  isGuest: (state: ProfileState) => state.privateProfile.id === GUEST_PROFILE.id,
  privateProfile: (state: ProfileState) => state.privateProfile,
  profileId: (state: ProfileState) => state.privateProfile?.id,
  profiles: (state: ProfileState) => state.profiles,
  publicProfile: (state: ProfileState) => {
    if (!(state.privateProfile?.id && state.profiles)) {
      return null;
    }
    return state.profiles[state.privateProfile.id] ?? null;
  },
};

export const getCurrentPublicProfile = () => {
  return useProfileStore.getState().profiles[useProfileStore.getState().privateProfile?.id];
};

export const getCurrentPrivateProfile = () => {
  return useProfileStore.getState().privateProfile;
};

export const getCurrentProfiles = () => {
  return useProfileStore.getState().profiles;
};

export const checkIsGuest = (): boolean => {
  return useProfileStore.getState().privateProfile.id === GUEST_PROFILE.id;
};
