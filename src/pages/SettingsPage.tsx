import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Shield, Database, Palette, Globe, Download, Wifi, WifiOff, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [alertSound, setAlertSound] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [expiryThreshold, setExpiryThreshold] = useState('30');
  const [stockThreshold, setStockThreshold] = useState('20');
  const [autoBackup, setAutoBackup] = useState(true);

  const handleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
    toast({ title: checked ? 'Mode sombre activé' : 'Mode clair activé' });
  };

  const handleSave = () => {
    toast({ title: 'Paramètres sauvegardés', description: 'Vos préférences ont été mises à jour avec succès.' });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Paramètres" breadcrumb={['PharmaStock BI', 'Paramètres']} />
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Apparence */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Apparence</CardTitle>
            </div>
            <CardDescription>Personnalisez l'interface selon vos préférences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
                <Label>Mode sombre</Label>
              </div>
              <Switch checked={darkMode} onCheckedChange={handleDarkMode} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Label>Langue</Label>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>Gérez vos préférences de notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Son d'alerte</Label>
              <Switch checked={alertSound} onCheckedChange={setAlertSound} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label>Notifications par email</Label>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>Notifications push</Label>
                <Badge variant="outline" className="text-[10px]">PWA</Badge>
              </div>
              <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
            </div>
          </CardContent>
        </Card>

        {/* Seuils d'alerte */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Seuils d'alerte</CardTitle>
            </div>
            <CardDescription>Définissez les seuils pour déclencher les alertes automatiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Alerte de péremption (jours avant expiration)</Label>
              <Input type="number" value={expiryThreshold} onChange={e => setExpiryThreshold(e.target.value)} className="w-24 text-center" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label>Seuil de stock critique (% du stock minimum)</Label>
              <Input type="number" value={stockThreshold} onChange={e => setStockThreshold(e.target.value)} className="w-24 text-center" />
            </div>
          </CardContent>
        </Card>

        {/* Synchronisation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Données & Synchronisation</CardTitle>
            </div>
            <CardDescription>Gérez la synchronisation et les sauvegardes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-muted-foreground" />
                <Label>Synchronisation automatique</Label>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WifiOff className="w-4 h-4 text-muted-foreground" />
                <Label>Mode hors-ligne</Label>
              </div>
              <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label>Sauvegarde automatique quotidienne</Label>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label>Exporter les données</Label>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Exporter CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8">Sauvegarder les paramètres</Button>
        </div>
      </div>
    </div>
  );
}
