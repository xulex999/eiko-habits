import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashAnimationProps {
  onComplete?: () => void;
}

export default function SplashAnimation({ onComplete }: SplashAnimationProps) {
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo springs in
    logoScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    logoOpacity.value = withTiming(1, { duration: 300 });

    // Text fades in with delay
    textTranslateY.value = withDelay(
      200,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }),
    );
    textOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 400 }),
    );

    // Complete after 1.5s
    const timer = setTimeout(() => {
      if (onComplete) {
        logoScale.value = withTiming(0.9, { duration: 200 });
        logoOpacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(onComplete)();
        });
        textOpacity.value = withTiming(0, { duration: 200 });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }],
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoAnimStyle]}>
        <View style={styles.logoCircle}>
          <Ionicons name="flash" size={48} color="#fff" />
        </View>
      </Animated.View>
      <Animated.View style={textAnimStyle}>
        <Text style={styles.title}>Eiko Habits</Text>
        <Text style={styles.subtitle}>Build better habits</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 8,
  },
});
