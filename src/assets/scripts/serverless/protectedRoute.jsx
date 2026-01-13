import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                setLoading(false);
            });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return null; // or a spinner
    }

    if (!session) {
        return <Navigate to="/" replace />;
    }

    return children;
}
