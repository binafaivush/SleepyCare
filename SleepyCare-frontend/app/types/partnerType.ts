export type PartnerRole = 'viewer' | 'editor' | 'admin';

export interface Partner {
  id: string;
  name: string;
  role: PartnerRole;
  fromInviteLink: boolean;
}
