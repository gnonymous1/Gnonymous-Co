import { useEffect } from 'react';
import { useGlobalStore } from '@/stores/useGlobalStore';

export const useHydration = () => {
    const { setApiKeys, setModelPreference } = useGlobalStore();

    useEffect(() => {
        const hydrate = async () => {
            try {
                const response = await fetch('/api/settings/hydrate');
                if (!response.ok) return;
                
                const data = await response.json();
                
                // Sync Keys (Status only if returned as status, but GlobalStore uses strings)
                // Note: GlobalStore expects actual keys, but we only return status for security.
                // We'll update the store to reflect 'configured' state if needed, 
                // but let's sync the model preferences first.
                
                if (data.model_prefs) {
                    Object.entries(data.model_prefs).forEach(([category, model]) => {
                        setModelPreference(category as any, model as any);
                    });
                }
                
                console.log("[Hydration] Backend state synced successfully.");
            } catch (error) {
                console.error("[Hydration] Failed to sync state from backend:", error);
            }
        };

        hydrate();
    }, [setApiKeys, setModelPreference]);
};
