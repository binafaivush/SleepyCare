import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  httpGetChildrenByCounselorId,
  httpGetChildrenByParentId,
  httpGetAllCounselors,
} from '../contexts/childrenService';

interface UserDataHook {
  children: { name: string; id: string }[];
  counselors: { name: string; id: string }[];
  currentCounselor: { name: string; id: string } | null;
  loading: boolean;
  error: string | null;
}

export const useUserData = (): UserDataHook => {
  const user = useSelector((state: RootState) => state.user);
  const [children, setChildren] = useState<{ name: string; id: string }[]>([]);
  const [counselors, setCounselors] = useState<{ name: string; id: string }[]>([]);
  const [currentCounselor, setCurrentCounselor] = useState<{ name: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        if (user.role === 'counselor') {
          const childrenRes = await httpGetChildrenByCounselorId(user.id);
          setChildren(childrenRes.map(child => ({ name: child.child_name, id: child._id })));
          setCurrentCounselor({ name: user.name, id: user.id });
        } else if (user.role === 'parent') {
          const childrenRes = await httpGetChildrenByParentId(user.id);
          const counselorsRes = await httpGetAllCounselors();
          setChildren(childrenRes.map(child => ({ name: child.child_name, id: child._id })));
          setCounselors(counselorsRes);
        }
      } catch (err: any) {
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { children, counselors, currentCounselor, loading, error };
};
