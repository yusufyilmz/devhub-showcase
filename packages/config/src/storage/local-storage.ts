export type Storage = {
  agentCompanion: string;
  userConfig: string;
  chat: string;
  draftRecovery: string;
  theme: string;
  version: number;
  name: string;
};

const name = "mydevstudio";

export const storage: Storage = {
  agentCompanion: `${name}:agent-companion`,
  chat: `${name}:chat`,
  draftRecovery: `${name}:draft-recovery`,
  theme: `${name}:theme`,
  userConfig: `${name}:user-config`,
  version: 2,
  name,
} as const;
