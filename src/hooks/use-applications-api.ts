import { applicationData } from '@src/data/applications';
import { Application } from '@src/types';
import axios from '@src/utils/axios';
import { useQuery } from '@tanstack/react-query';

const getApplications = async (): Promise<Application[]> => {
  // const response = await axios.get('/applications');
  // return response.data.items;
  return Promise.resolve(applicationData.items);
};

const getApplication = async (id: number): Promise<Application | undefined> => {
  // const response = await axios.get(`/applications/${id}`);
  // return response.data;
  return Promise.resolve(applicationData.items.find((a) => a.id === id));
};

const useApplicationsApi = () => {
  const applicationsQuery = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
  });

  const applicationQuery = (id: number) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ['applications', id],
      queryFn: () => getApplication(id),
    });

  return {
    getApplications: applicationsQuery,
    getApplication: applicationQuery,
  };
};

export default useApplicationsApi;
