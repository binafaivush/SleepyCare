import { PartnerRole } from '../types/partnerType';

export const getPartners = async () => {
  return new Promise<any>((resolve) =>
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Ruth Cohen', role: 'viewer', fromInviteLink: true },
        { id: '2', name: 'Moshe Levi', role: 'editor', fromInviteLink: false },
      ]);
    }, 500)
  );
};

export const updatePartnerRole = async (id: string, role: PartnerRole) => {
  console.log(`Updated ${id} to role ${role}`);
};

export const deletePartner = async (id: string) => {
  console.log(`Deleted partner ${id}`);
};

export const createInviteLink = async () => {
  return 'https://yourapp.com/invite/abc123';
};
