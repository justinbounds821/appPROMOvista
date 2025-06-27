import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@services/supabase/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean; // Indică dacă se încarcă starea inițială a sesiunii
  signOut: () => Promise<void>;
  // setUserManually: (user: User | null, session: Session | null) => void; // Pentru testare sau cazuri speciale
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Începe ca true pentru a încărca sesiunea inițială

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error.message);
          // Nu seta loading la false aici dacă vrei să încerci din nou sau să ai un fallback
        }
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (e) {
        console.error('Unexpected error fetching session:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Listener pentru schimbările de stare a autentificării
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        console.log('Auth state changed:', _event, currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        // Nu mai este nevoie de setLoading(false) aici, deoarece starea inițială a fost deja gestionată
      }
    );

    return () => {
      // Cleanup listener la unmount
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    setLoading(true); // Poate fi util să arăți un loader la sign out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      Alert.alert('Eroare', 'Nu s-a putut efectua deconectarea.');
    }
    // Starea va fi actualizată automat de onAuthStateChange listener
    // setUser(null);
    // setSession(null);
    setLoading(false);
  };

  // const setUserManually = (newUser: User | null, newSession: Session | null) => {
  //   setUser(newUser);
  //   setSession(newSession);
  // };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut /*, setUserManually */ }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
