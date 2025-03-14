'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  Mail,
  MessageSquare,
  Shield,
  Smartphone,
  User,
  Lock,
  Key,
  Database,
  Activity,
} from 'lucide-react';

// Translations for different languages
const translations = {
  en: {
    systemSettings: 'System Settings',
    notificationPreferences: 'Notification Preferences',
    emailNotifications: 'Email Notifications',
    receiveSystemAlerts: 'Receive system alerts via email',
    smsNotifications: 'SMS Notifications',
    receiveCriticalAlerts: 'Receive critical alerts via SMS',
    pushNotifications: 'Push Notifications',
    receiveAlertsOnMobile: 'Receive alerts on your mobile device',
    securitySettings: 'Security Settings',
    twoFactorAuth: 'Two-Factor Authentication',
    extraLayerSecurity: 'Add an extra layer of security',
    passwordRequirements: 'Password Requirements',
    enforceStrongPasswords: 'Enforce strong passwords',
    activityLogging: 'Activity Logging',
    trackSystemActivities: 'Track system activities',
    systemConfiguration: 'System Configuration',
    motionDetectionSensitivity: 'Motion Detection Sensitivity',
    low: 'Low',
    high: 'High',
    dataRetentionPeriod: 'Data Retention Period',
    selectPeriod: 'Select period',
    days: 'days',
    year: 'year',
    enableAnalytics: 'Enable Analytics',
    userPreferences: 'User Preferences',
    theme: 'Theme',
    selectTheme: 'Select theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    language: 'Language',
    selectLanguage: 'Select language',
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    timeZone: 'Time Zone',
    selectTimezone: 'Select timezone',
    saveChanges: 'Save Changes',
  },
  es: {
    systemSettings: 'Configuración del Sistema',
    notificationPreferences: 'Preferencias de Notificación',
    emailNotifications: 'Notificaciones por Correo',
    receiveSystemAlerts: 'Recibir alertas del sistema por correo',
    smsNotifications: 'Notificaciones SMS',
    receiveCriticalAlerts: 'Recibir alertas críticas por SMS',
    pushNotifications: 'Notificaciones Push',
    receiveAlertsOnMobile: 'Recibir alertas en tu dispositivo móvil',
    securitySettings: 'Configuración de Seguridad',
    twoFactorAuth: 'Autenticación de Dos Factores',
    extraLayerSecurity: 'Añadir una capa extra de seguridad',
    passwordRequirements: 'Requisitos de Contraseña',
    enforceStrongPasswords: 'Exigir contraseñas fuertes',
    activityLogging: 'Registro de Actividad',
    trackSystemActivities: 'Seguimiento de actividades del sistema',
    systemConfiguration: 'Configuración del Sistema',
    motionDetectionSensitivity: 'Sensibilidad de Detección de Movimiento',
    low: 'Baja',
    high: 'Alta',
    dataRetentionPeriod: 'Período de Retención de Datos',
    selectPeriod: 'Seleccionar período',
    days: 'días',
    year: 'año',
    enableAnalytics: 'Habilitar Análisis',
    userPreferences: 'Preferencias de Usuario',
    theme: 'Tema',
    selectTheme: 'Seleccionar tema',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    language: 'Idioma',
    selectLanguage: 'Seleccionar idioma',
    english: 'Inglés',
    spanish: 'Español',
    french: 'Francés',
    timeZone: 'Zona Horaria',
    selectTimezone: 'Seleccionar zona horaria',
    saveChanges: 'Guardar Cambios',
  },
  fr: {
    systemSettings: 'Paramètres du Système',
    notificationPreferences: 'Préférences de Notification',
    emailNotifications: 'Notifications par Email',
    receiveSystemAlerts: 'Recevoir des alertes système par email',
    smsNotifications: 'Notifications SMS',
    receiveCriticalAlerts: 'Recevoir des alertes critiques par SMS',
    pushNotifications: 'Notifications Push',
    receiveAlertsOnMobile: 'Recevoir des alertes sur votre appareil mobile',
    securitySettings: 'Paramètres de Sécurité',
    twoFactorAuth: 'Authentification à Deux Facteurs',
    extraLayerSecurity: 'Ajouter une couche supplémentaire de sécurité',
    passwordRequirements: 'Exigences de Mot de Passe',
    enforceStrongPasswords: 'Imposer des mots de passe forts',
    activityLogging: "Journalisation d'Activité",
    trackSystemActivities: 'Suivre les activités du système',
    systemConfiguration: 'Configuration du Système',
    motionDetectionSensitivity: 'Sensibilité de Détection de Mouvement',
    low: 'Basse',
    high: 'Haute',
    dataRetentionPeriod: 'Période de Conservation des Données',
    selectPeriod: 'Sélectionner une période',
    days: 'jours',
    year: 'an',
    enableAnalytics: "Activer l'Analyse",
    userPreferences: 'Préférences Utilisateur',
    theme: 'Thème',
    selectTheme: 'Sélectionner un thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    language: 'Langue',
    selectLanguage: 'Sélectionner une langue',
    english: 'Anglais',
    spanish: 'Espagnol',
    french: 'Français',
    timeZone: 'Fuseau Horaire',
    selectTimezone: 'Sélectionner un fuseau horaire',
    saveChanges: 'Enregistrer les Modifications',
  },
};

export function FloatingCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        y: {
          type: 'spring',
          damping: 10,
          stiffness: 100,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({ children, className }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Settings() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [t, setT] = useState(translations.en);

  // Apply theme changes
  useEffect(() => {
    // Remove previous theme
    document.documentElement.classList.remove('dark', 'light');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'system') {
      // Check system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [theme]);

  // Apply language changes
  useEffect(() => {
    setT(translations[language]);
  }, [language]);

  // Handle theme change
  const handleThemeChange = (value) => {
    setTheme(value);
  };

  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  // Save changes
  const handleSaveChanges = () => {
    // Here you would typically save to a database or localStorage
    alert(`Settings saved! Theme: ${theme}, Language: ${language}`);
  };

  return (
    <div
      className={`space-y-6 ${
        theme === 'dark'
          ? 'dark bg-gray-900 text-white'
          : 'bg-white text-gray-800'
      }`}
    >
      <motion.h2
        className="text-2xl font-semibold mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t.systemSettings}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingCard delay={0.1}>
          <FloatingElement className="h-full">
            <Card
              className={`${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                  : 'bg-gradient-to-br from-blue-50 to-white border-blue-100'
              } h-full`}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div
                  className={`p-2 ${
                    theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
                  } rounded-lg`}
                >
                  <Bell
                    className={`h-6 w-6 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  />
                </div>
                <CardTitle className="text-lg font-medium">
                  {t.notificationPreferences}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`flex items-center justify-between p-2 ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                  } rounded-lg transition-colors`}
                >
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <Label className="flex flex-col">
                      <span className="font-medium">
                        {t.emailNotifications}
                      </span>
                      <span
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {t.receiveSystemAlerts}
                      </span>
                    </Label>
                  </div>
                  <Switch />
                </div>

                <div
                  className={`flex items-center justify-between p-2 ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                  } rounded-lg transition-colors`}
                >
                  <div className="flex items-center space-x-4">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <Label className="flex flex-col">
                      <span className="font-medium">{t.smsNotifications}</span>
                      <span
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {t.receiveCriticalAlerts}
                      </span>
                    </Label>
                  </div>
                  <Switch />
                </div>

                <div
                  className={`flex items-center justify-between p-2 ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                  } rounded-lg transition-colors`}
                >
                  <div className="flex items-center space-x-4">
                    <Smartphone className="h-5 w-5 text-gray-500" />
                    <Label className="flex flex-col">
                      <span className="font-medium">{t.pushNotifications}</span>
                      <span
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {t.receiveAlertsOnMobile}
                      </span>
                    </Label>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </FloatingCard>

        <FloatingCard delay={0.2}>
          <FloatingElement className="h-full">
            <Card
              className={`${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                  : 'bg-gradient-to-br from-purple-50 to-white border-purple-100'
              } h-full`}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div
                  className={`p-2 ${
                    theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'
                  } rounded-lg`}
                >
                  <Shield
                    className={`h-6 w-6 ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  />
                </div>
                <CardTitle className="text-lg font-medium">
                  {t.securitySettings}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`flex items-center justify-between p-2 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-purple-50'
                  } rounded-lg transition-colors`}
                >
                  <div className="flex items-center space-x-4">
                    <Key className="h-5 w-5 text-gray-500" />
                    <Label className="flex flex-col">
                      <span className="font-medium">{t.twoFactorAuth}</span>
                      <span
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {t.extraLayerSecurity}
                      </span>
                    </Label>
                  </div>
                  <Switch />
                </div>

                <div
                  className={`flex items-center justify-between p-2 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-purple-50'
                  } rounded-lg transition-colors`}
                >
                  <div className="flex items-center space-x-4">
                    <Lock className="h-5 w-5 text-gray-500" />
                    <Label className="flex flex-col">
                      <span className="font-medium">
                        {t.passwordRequirements}
                      </span>
                      <span
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {t.enforceStrongPasswords}
                      </span>
                    </Label>
                  </div>
                  <Switch />
                </div>

                <div
                  className={`flex items-center justify-between p-2 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-purple-50'
                  } rounded-lg transition-colors`}
                >
                  <div className="flex items-center space-x-4">
                    <Activity className="h-5 w-5 text-gray-500" />
                    <Label className="flex flex-col">
                      <span className="font-medium">{t.activityLogging}</span>
                      <span
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {t.trackSystemActivities}
                      </span>
                    </Label>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </FloatingCard>

        <FloatingCard delay={0.3}>
          <FloatingElement className="h-full">
            <Card
              className={`${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                  : 'bg-gradient-to-br from-green-50 to-white border-green-100'
              } h-full`}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div
                  className={`p-2 ${
                    theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
                  } rounded-lg`}
                >
                  <Database
                    className={`h-6 w-6 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}
                  />
                </div>
                <CardTitle className="text-lg font-medium">
                  {t.systemConfiguration}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-medium">
                    {t.motionDetectionSensitivity}
                  </Label>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{t.low}</span>
                    <span>{t.high}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">{t.dataRetentionPeriod}</Label>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.selectPeriod} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 {t.days}</SelectItem>
                      <SelectItem value="30">30 {t.days}</SelectItem>
                      <SelectItem value="90">90 {t.days}</SelectItem>
                      <SelectItem value="365">1 {t.year}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="analytics" />
                  <Label htmlFor="analytics" className="text-sm">
                    {t.enableAnalytics}
                  </Label>
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </FloatingCard>

        <FloatingCard delay={0.4}>
          <FloatingElement className="h-full">
            <Card
              className={`${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                  : 'bg-gradient-to-br from-orange-50 to-white border-orange-100'
              } h-full`}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div
                  className={`p-2 ${
                    theme === 'dark' ? 'bg-orange-900' : 'bg-orange-100'
                  } rounded-lg`}
                >
                  <User
                    className={`h-6 w-6 ${
                      theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                    }`}
                  />
                </div>
                <CardTitle className="text-lg font-medium">
                  {t.userPreferences}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">{t.theme}</Label>
                  <Select value={theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.selectTheme} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t.light}</SelectItem>
                      <SelectItem value="dark">{t.dark}</SelectItem>
                      <SelectItem value="system">{t.system}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">{t.language}</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.selectLanguage} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t.english}</SelectItem>
                      <SelectItem value="es">{t.spanish}</SelectItem>
                      <SelectItem value="fr">{t.french}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">{t.timeZone}</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.selectTimezone} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">EST</SelectItem>
                      <SelectItem value="pst">PST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </FloatingCard>
      </div>

      <FloatingCard delay={0.5}>
        <div className="flex justify-end">
          <Button
            className={`${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-8`}
            onClick={handleSaveChanges}
          >
            {t.saveChanges}
          </Button>
        </div>
      </FloatingCard>
    </div>
  );
}
