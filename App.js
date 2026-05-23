import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { LayoutDashboard, BrainCircuit, CalendarClock, ShieldCheck, BarChart3, Send, Zap, Lock } from 'lucide-react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [disciplineScore, setDisciplineScore] = useState(88);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'AI', text: "Hey! I noticed you unlocked your phone 5 times in the last hour. Are we building an empire today, or scrolling away our future?" }
  ]);

  // Funksionka la hadalka AI Coach Backend API
  const sendToAICoach = async () => {
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatHistory([...chatHistory, { id: Date.now(), sender: 'USER', text: userText }]);
    setChatMessage('');

    try {
      // Halkan waxaa lagu beddelayaa IP-ga server-kaaga Django hadhow
      const response = await fetch('http://YOUR_BACKEND_IP/api/coach/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN_HERE' 
        },
        body: JSON.stringify({ message: userText })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setChatHistory(prev => [...prev, { id: Date.now() + 1, sender: 'AI', text: data.ai_message }]);
        setDisciplineScore(data.current_discipline_score);
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { id: Date.now() + 1, sender: 'AI', text: "Ma awoodo inaan la xiriiro server-ka hadda. Focus-ka ilaali saaxiib!" }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      
      {/* SCREEN CONTAINER */}
      <View style={styles.screenContainer}>
        
        {/* 1. ONBOARDING SCREEN */}
        {currentScreen === 'onboarding' && (
          <View style={styles.onboardingView}>
            <View style={styles.centerItems}>
              <View style={styles.iconBox}>
                <Lock color="#FFF" size={40} />
              </View>
              <Text style={styles.titleText}>FocusLock AI</Text>
              <Text style={styles.subtitleText}>
                Defeat your phone addiction, unlock true discipline, and crush your goals with AI coaching.
              </Text>
            </View>

            <TouchableOpacity 
              onPress={() => setCurrentScreen('dashboard')}
              style={styles.primaryBtn}>
              <Text style={styles.btnText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2. DASHBOARD SCREEN */}
        {currentScreen === 'dashboard' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gapVertical}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.miniLabel}>Welcome Back,</Text>
                <Text style={styles.mainHeader}>Focus Champion ⚡</Text>
              </View>
              <View style={styles.streakBadge}>
                <Zap color="#F59E0B" size={16} fill="#F59E0B" />
                <Text style={styles.streakText}>7 Day Streak</Text>
              </View>
            </View>

            {/* Score Card */}
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Discipline Score</Text>
              <Text style={styles.scoreNumber}>{disciplineScore}</Text>
              <Text style={styles.scoreTrend}>▲ +5% better than yesterday</Text>
            </View>

            {/* Emergency Lock */}
            <View style={styles.emergencyCard}>
              <View>
                <Text style={styles.cardTitle}>Emergency Deep Focus</Text>
                <Text style={styles.cardDesc}>Block all apps instantly.</Text>
              </View>
              <TouchableOpacity style={styles.redBtn}>
                <Text style={styles.redBtnText}>Lock Now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* 3. AI COACH CHAT SCREEN */}
        {currentScreen === 'coach' && (
          <View style={styles.flexOne}>
            <View style={styles.coachHeader}>
              <View style={styles.coachIconBox}>
                <BrainCircuit color="#FFF" size={20} />
              </View>
              <View>
                <Text style={styles.coachTitle}>FocusLock AI Coach</Text>
                <Text style={styles.coachStatus}>● Online & Motivated</Text>
              </View>
            </View>

            <ScrollView style={styles.chatArea}>
              {chatHistory.map(chat => (
                <View key={chat.id} style={[styles.chatBubble, chat.sender === 'USER' ? styles.userBubble : styles.aiBubble]}>
                  <Text style={styles.chatText}>{chat.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput 
                value={chatMessage}
                onChangeText={setChatMessage}
                placeholder="Talk to your subconscious..." 
                placeholderTextColor="#71717A"
                style={styles.inputField}
              />
              <TouchableOpacity onPress={sendToAICoach} style={styles.sendBtn}>
                <Send color="#FFF" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>

      {/* FOOTER NAVIGATION BAR */}
      {currentScreen !== 'onboarding' && (
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => setCurrentScreen('dashboard')} style={styles.navItem}>
            <LayoutDashboard color={currentScreen === 'dashboard' ? '#A855F7' : '#71717A'} size={20} />
            <Text style={[styles.navText, currentScreen === 'dashboard' && styles.navTextActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('coach')} style={styles.navItem}>
            <BrainCircuit color={currentScreen === 'coach' ? '#A855F7' : '#71717A'} size={20} />
            <Text style={[styles.navText, currentScreen === 'coach' && styles.navTextActive]}>AI Coach</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  screenContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 },
  flexOne: { flex: 1, justifyContent: 'space-between' },
  gapVertical: { gap: 20 },
  centerItems: { itemsCenter: 'center', marginTop: 40, alignItems: 'center' },
  onboardingView: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 40 },
  iconBox: { width: 80, height: 80, backgroundColor: '#A855F7', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  titleText: { fontSize: 30, fontWeight: '900', color: '#FFF', marginTop: 16 },
  subtitleText: { textAlign: 'center', color: '#A1A1AA', fontSize: 14, marginTop: 8, paddingHorizontal: 24 },
  primaryBtn: { width: '100%', py: 16, backgroundColor: '#A855F7', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniLabel: { fontSize: 12, color: '#71717A' },
  mainHeader: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#27272A' },
  streakText: { color: '#F59E0B', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  scoreCard: { backgroundColor: '#18181B', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#27272A', alignItems: 'center' },
  scoreLabel: { fontSize: 12, color: '#A1A1AA', fontWeight: '600', trackingWidth: 1 },
  scoreNumber: { fontSize: 60, fontWeight: '900', color: '#A855F7', my: 8 },
  scoreTrend: { fontSize: 12, color: '#34D399', fontWeight: '500' },
  emergencyCard: { backgroundColor: '#18181B', borderWidth: 1, borderColor: '#3F3F46', padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  cardDesc: { fontSize: 12, color: '#A1A1AA', marginTop: 2 },
  redBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#DC2626', borderRadius: 8 },
  redBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  coachHeader: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#27272A', paddingBottom: 12, gap: 12 },
  coachIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#A855F7', alignItems: 'center', justifyContent: 'center' },
  coachTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  coachStatus: { fontSize: 12, color: '#10B981' },
  chatArea: { flex: 1, marginVertical: 12 },
  chatBubble: { p: 12, padding: 12, borderRadius: 16, maxValue: '85%', marginBottom: 10, maxWidth: '85%' },
  userBubble: { backgroundColor: '#2563EB', marginLeft: 'auto', borderTopRightRadius: 0 },
  aiBubble: { backgroundColor: '#18181B', borderTopLeftRadius: 0, borderLeftWidth: 2, borderLeftColor: '#A855F7' },
  chatText: { color: '#FFF', fontSize: 12, lineHeight: 20 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  inputField: { flex: 1, backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 12, color: '#FFF' },
  sendBtn: { padding: 14, backgroundColor: '#A855F7', borderRadius: 12, marginLeft: 8 },
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, backgroundColor: '#09090B', borderTopWidth: 1, borderTopColor: '#27272A', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 10, color: '#71717A', marginTop: 4 },
  navTextActive: { color: '#A855F7' }
});
