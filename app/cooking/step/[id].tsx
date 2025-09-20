import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAccentColors } from "@/hooks/use-system-accent";
import { RecipeType } from "@/types/recipe";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Home,
  PlayCircle,
  StopCircle,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  Vibration,
} from "react-native";

export default function CookingStepScreen() {
  const { id, servings, recipe, currentStep } = useLocalSearchParams<{
    id: string;
    servings: string;
    recipe: string;
    currentStep: string;
  }>();

  const recipeData: RecipeType = JSON.parse(recipe || "{}");
  const selectedServings = parseInt(servings || "1");
  const originalServings = recipeData.servings;
  const servingMultiplier = selectedServings / originalServings;
  const stepIndex = parseInt(currentStep || "0");
  const currentStepData = recipeData.steps[stepIndex];
  const totalSteps = recipeData.steps.length;
  const accentColors = useAccentColors();
  const { t } = useTranslation();

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isTimerRunning && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setIsTimerRunning(false);
            // Timer finished - vibrate and show alert
            if (Platform.OS !== "web") {
              Vibration.vibrate([500, 250, 500]);
            }
            Alert.alert(
              t("cook.timerFinished"),
              t("cook.stepComplete", { stepName: currentStepData.name }),
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemaining, currentStepData.name, t]);

  const startTimer = () => {
    setTimeRemaining(currentStepData.duration * 60); // Convert minutes to seconds
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatQuantity = (quantity?: number, unit?: string) => {
    if (!quantity) return "";

    const adjustedQuantity = quantity * servingMultiplier;
    let displayQuantity = adjustedQuantity;

    if (adjustedQuantity % 1 !== 0) {
      displayQuantity = Math.round(adjustedQuantity * 100) / 100;
    }

    return `${displayQuantity}${unit ? ` ${unit}` : ""}`;
  };

  const handleNextStep = () => {
    if (stepIndex < totalSteps - 1) {
      router.push({
        pathname: "/cooking/step/[id]",
        params: {
          id,
          servings,
          recipe,
          currentStep: (stepIndex + 1).toString(),
        },
      });
    } else {
      // Recipe completed
      Alert.alert(t("cook.recipeComplete"), t("cook.enjoyMeal"), [
        {
          text: t("cook.backToRecipe"),
          onPress: () => router.push(`/recipe/${id}`),
        },
        {
          text: t("cook.backToHome"),
          onPress: () => router.push("/"),
        },
      ]);
    }
  };

  const handlePreviousStep = () => {
    if (stepIndex > 0) {
      router.push({
        pathname: "/cooking/step/[id]",
        params: {
          id,
          servings,
          recipe,
          currentStep: (stepIndex - 1).toString(),
        },
      });
    } else {
      router.back();
    }
  };

  const progressPercentage = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <ThemedView
      className="flex-1"
      style={{ backgroundColor: accentColors.base }}
    >
      {/* Header */}
      <ThemedView
        className="px-6 pt-16 pb-4"
        style={{ backgroundColor: accentColors.base }}
      >
        <ThemedView
          className="flex-row items-center justify-between mb-4"
          style={{ backgroundColor: accentColors.base }}
        >
          <TouchableOpacity onPress={handlePreviousStep}>
            <ArrowLeft size={24} color={accentColors.subtext0} />
          </TouchableOpacity>
          <ThemedText
            className="font-medium"
            style={{ color: accentColors.text }}
          >
            {t("cook.stepProgress", {
              current: stepIndex + 1,
              total: totalSteps,
            })}
          </ThemedText>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Home size={24} color={accentColors.subtext0} />
          </TouchableOpacity>
        </ThemedView>

        {/* Progress Bar */}
        <ThemedView
          className="h-2 rounded-full mb-4"
          style={{ backgroundColor: accentColors.surface }}
        >
          <ThemedView
            className="h-2 rounded-full"
            style={{
              backgroundColor: accentColors.primary,
              width: `${progressPercentage}%`,
            }}
          />
        </ThemedView>

        <ThemedText
          className="text-center text-sm"
          style={{ color: accentColors.subtext1 }}
        >
          {recipeData.title}
        </ThemedText>
      </ThemedView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Step Header */}
        <ThemedView
          className="mx-6 mb-6 rounded-2xl p-6"
          style={{ backgroundColor: accentColors.surface }}
        >
          <ThemedView
            className="flex-row items-center justify-between mb-4"
            style={{ backgroundColor: accentColors.surface }}
          >
            <ThemedView
              className="flex-row items-center gap-3"
              style={{ backgroundColor: accentColors.surface }}
            >
              <ThemedView
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: accentColors.primary }}
              >
                <ThemedText type="button" className="font-bold text-lg">
                  {currentStepData.order}
                </ThemedText>
              </ThemedView>
              <ThemedText
                className="font-semibold text-xl flex-1"
                style={{ color: accentColors.text }}
              >
                {currentStepData.name}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Timer Section */}
          <ThemedView
            className="flex-row items-center justify-between mb-4 p-4 rounded-xl"
            style={{ backgroundColor: accentColors.base }}
          >
            <ThemedView
              className="flex-row items-center gap-2"
              style={{ backgroundColor: accentColors.base }}
            >
              <Clock size={20} color={accentColors.primary} />
              <ThemedText
                className="font-medium"
                style={{ color: accentColors.text }}
              >
                {timeRemaining !== null
                  ? formatTime(timeRemaining)
                  : `${currentStepData.duration} ${t("global.minutes")}`}
              </ThemedText>
            </ThemedView>

            <ThemedView
              className="flex-row gap-2"
              style={{ backgroundColor: accentColors.base }}
            >
              {!isTimerRunning && timeRemaining === null && (
                <TouchableOpacity
                  onPress={startTimer}
                  className="flex-row items-center gap-1 px-4 py-2 rounded-lg"
                  style={{ backgroundColor: accentColors.primary }}
                >
                  <PlayCircle size={16} color={accentColors.crust} />
                  <ThemedText
                    className="font-medium text-sm"
                    style={{ color: accentColors.crust }}
                  >
                    {t("cook.startTimer")}
                  </ThemedText>
                </TouchableOpacity>
              )}

              {(isTimerRunning || timeRemaining !== null) && (
                <TouchableOpacity
                  onPress={stopTimer}
                  className="flex-row items-center gap-1 px-4 py-2 rounded-lg"
                  style={{ backgroundColor: accentColors.subtext0 }}
                >
                  <StopCircle size={16} color={accentColors.crust} />
                  <ThemedText
                    className="font-medium text-sm"
                    style={{ color: accentColors.crust }}
                  >
                    {t("cook.stopTimer")}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          </ThemedView>

          <ThemedText
            className="leading-6 text-base"
            style={{ color: accentColors.text }}
          >
            {currentStepData.description}
          </ThemedText>
        </ThemedView>

        {/* Step Ingredients */}
        {currentStepData.ingredients.length > 0 && (
          <ThemedView
            className="mx-6 mb-6 rounded-2xl p-4"
            style={{ backgroundColor: accentColors.surface }}
          >
            <ThemedText
              className="font-semibold mb-4 text-lg"
              style={{ color: accentColors.text }}
            >
              {t("cook.stepIngredients")}
            </ThemedText>

            {currentStepData.ingredients.map((ingredient, index) => (
              <ThemedView
                key={index}
                className="flex-row items-center justify-between py-2 border-b"
                style={{
                  backgroundColor: accentColors.surface,
                  borderBottomColor: accentColors.base,
                  borderBottomWidth:
                    index === currentStepData.ingredients.length - 1 ? 0 : 1,
                }}
              >
                <ThemedText
                  className="flex-1 text-base"
                  style={{ color: accentColors.text }}
                >
                  {ingredient.name}
                </ThemedText>
                <ThemedText
                  className="font-medium text-base"
                  style={{ color: accentColors.primary }}
                >
                  {formatQuantity(ingredient.quantity, ingredient.unit)}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* Bottom spacing */}
        <ThemedView
          style={{ height: 120, backgroundColor: accentColors.base }}
        />
      </ScrollView>

      {/* Navigation Buttons */}
      <ThemedView
        className="absolute bottom-0 left-0 right-0 p-6 flex-row gap-4"
        style={{ backgroundColor: accentColors.base }}
      >
        {stepIndex > 0 && (
          <TouchableOpacity
            className="flex-1 rounded-2xl py-4 items-center"
            style={{ backgroundColor: accentColors.surface }}
            activeOpacity={0.8}
            onPress={handlePreviousStep}
          >
            <ThemedView
              className="flex-row items-center gap-2"
              style={{ backgroundColor: "transparent" }}
            >
              <ArrowLeft size={20} color={accentColors.text} />
              <ThemedText
                className="font-semibold"
                style={{ color: accentColors.text }}
              >
                {t("cook.previous")}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="flex-1 rounded-2xl py-4 items-center shadow-lg"
          style={{ backgroundColor: accentColors.primary }}
          activeOpacity={0.8}
          onPress={handleNextStep}
        >
          <ThemedView
            className="flex-row items-center gap-2"
            style={{ backgroundColor: "transparent" }}
          >
            {stepIndex < totalSteps - 1 ? (
              <>
                <ThemedText type="button" className="font-semibold text-lg">
                  {t("cook.nextStep")}
                </ThemedText>
                <ArrowRight size={20} color={accentColors.crust} />
              </>
            ) : (
              <>
                <CheckCircle size={20} color={accentColors.crust} />
                <ThemedText type="button" className="font-semibold text-lg">
                  {t("cook.finish")}
                </ThemedText>
              </>
            )}
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
