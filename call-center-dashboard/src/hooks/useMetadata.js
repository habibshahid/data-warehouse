import { useState, useEffect }                               from 'react';
import { fetchQueues, fetchChannels, fetchAvailableMetrics } from '../apis/metaData';
import { message }                                           from 'antd';

/**
 * Custom hook for fetching and managing metadata for dashboard sections
 * @param {string} timeInterval - Optional time interval to fetch metrics for
 * @returns {Object} - Object containing available metadata and loading state
 */
export const useMetadata = (timeInterval = 'daily') => {

  // State for available metadata
  const [availableMetadata, setAvailableMetadata] = useState({
    queues: [],
    channels: [],
    models: [],
    attributes: null
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Error state
  const [error, setError] = useState(null);

  // Fetch queues and channels on component mount, but only once
  useEffect(() => {

    const fetchMetadata = async () => {

      try {

        // Fetch queues
        const queues = await fetchQueues();

        // Fetch channels
        const channels = await fetchChannels();

        const { attributes, models } = await fetchAvailableMetrics();

        console.log(queues, channels, "oooooooooooooooo")

        setAvailableMetadata(prevState => ({
          ...prevState,
          queues,
          channels,
          models,
          attributes
        }));

      }
      catch (error) {
        console.error('Error fetching metadata:', error);
        setError(error.message || 'Failed to fetch metadata');
        message.error('Failed to load queues and channels');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);


  return {
    availableMetadata,
    isLoading,
    error,
  };
};

export default useMetadata;