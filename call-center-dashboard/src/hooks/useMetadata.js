import { useEffect, useContext, useState } from 'react';
import { DashboardContext } from '../contexts/DashboardContext';
import { fetchQueues, fetchChannels, fetchAvailableMetrics } from '../api/metadataService';
import { message } from 'antd';

export const useMetadata = () => {
  const {
    timeInterval,
    availableMetadata,
    setMetadata,
    setLoading,
    setError,
  } = useContext(DashboardContext);
  
  // Add state to track if fetch has been attempted
  const [hasFetchedQueuesAndChannels, setHasFetchedQueuesAndChannels] = useState(false);
  const [hasFetchedMetrics, setHasFetchedMetrics] = useState(false);
  
  // Fetch queues and channels on component mount, but only once
  useEffect(() => {
    // Skip if we've already fetched or if the metadata is already populated
    if (hasFetchedQueuesAndChannels || 
        (availableMetadata.queues.length > 0 && availableMetadata.channels.length > 0)) {
      return;
    }
    
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        
        // Fetch queues
        const queues = await fetchQueues();
        
        // Fetch channels
        const channels = await fetchChannels();
        
        setMetadata({
          queues,
          channels,
        });
        
        // Mark as fetched regardless of success/failure
        setHasFetchedQueuesAndChannels(true);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setError(error.message || 'Failed to fetch metadata');
        message.error('Failed to load queues and channels');
        
        // Still mark as fetched to prevent infinite loop
        setHasFetchedQueuesAndChannels(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetadata();
  }, [setMetadata, setLoading, setError, hasFetchedQueuesAndChannels, availableMetadata.queues.length, availableMetadata.channels.length]);
  
  // Fetch available metrics when timeInterval changes, but only once per timeInterval change
  useEffect(() => {
    // Reset the fetch state when timeInterval changes
    setHasFetchedMetrics(false);
  }, [timeInterval]);
  
  useEffect(() => {
    // Skip if we've already fetched for this time interval or if metrics are already populated
    if (hasFetchedMetrics || availableMetadata.metrics.length > 0) {
      return;
    }
    
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        // Fetch available metrics based on the selected time interval
        const metrics = await fetchAvailableMetrics(timeInterval);
        
        setMetadata({
          metrics,
        });
        
        // Mark as fetched regardless of success/failure
        setHasFetchedMetrics(true);
      } catch (error) {
        console.error('Error fetching available metrics:', error);
        setError(error.message || 'Failed to fetch available metrics');
        message.error('Failed to load available metrics');
        
        // Still mark as fetched to prevent infinite loop
        setHasFetchedMetrics(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [timeInterval, setMetadata, setLoading, setError, hasFetchedMetrics, availableMetadata.metrics.length]);
  
  return {
    availableMetadata,
  };
};