import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, Building2, Shield, Clock, Key, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    firstName: 'Abdallah',
    lastName: 'Benali',
    email: 'a.benali@pharmastock.com',
    phone: '+212 6 12 34 56 78',
    role: 'pharmacien',
    site: 'Entrepôt Central — Casablanca',
    department: 'Gestion des stocks',
  });

  const handleSave = () => {
    toast({ title: 'Profil mis à jour', description: 'Vos informations ont été enregistrées.' });
  };

  const sessions = [
    { device: 'Chrome — Windows 11', ip: '192.168.1.45', date: '30/03/2026 08:12', current: true },
    { device: 'Safari — iPhone 15', ip: '10.0.0.12', date: '29/03/2026 17:30', current: false },
    { device: 'Firefox — macOS', ip: '192.168.1.78', date: '28/03/2026 09:15', current: false },
  ];

  const roleLabels: Record<string, string> = {
    pharmacien: 'Pharmacien',
    gestionnaire: 'Gestionnaire de stock',
    directeur: 'Directeur',
    admin: 'Administrateur',
  };

  const roleBadgeColor: Record<string, string> = {
    pharmacien: 'bg-primary/10 text-primary',
    gestionnaire: 'bg-info/10 text-info',
    directeur: 'bg-warning/10 text-warning',
    admin: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Mon Profil" breadcrumb={['PharmaStock BI', 'Profil']} />
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <Card>
          <CardContent className="flex items-center gap-6 py-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">{profile.firstName} {profile.lastName}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={roleBadgeColor[profile.role] + ' border-0'}>{roleLabels[profile.role]}</Badge>
                <Badge variant="outline" className="text-xs">{profile.site}</Badge>
              </div>
            </div>
            <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4" /> Déconnexion
            </Button>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Informations personnelles</CardTitle>
            </div>
            <CardDescription>Modifiez vos informations de profil</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</Label>
              <Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Téléphone</Label>
              <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> Site</Label>
              <Input value={profile.site} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Département</Label>
              <Input value={profile.department} readOnly className="bg-muted" />
            </div>
          </CardContent>
        </Card>

        {/* Rôle & Permissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Rôle & Permissions</CardTitle>
            </div>
            <CardDescription>Votre rôle détermine vos accès dans le système (GxP)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Rôle actuel</Label>
              <Select value={profile.role} onValueChange={v => setProfile(p => ({ ...p, role: v }))}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pharmacien">Pharmacien</SelectItem>
                  <SelectItem value="gestionnaire">Gestionnaire de stock</SelectItem>
                  <SelectItem value="directeur">Directeur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted rounded-lg"><span className="font-medium">Stocks</span><p className="text-muted-foreground text-xs mt-1">Lecture / Écriture</p></div>
              <div className="p-3 bg-muted rounded-lg"><span className="font-medium">Commandes</span><p className="text-muted-foreground text-xs mt-1">Lecture / Écriture</p></div>
              <div className="p-3 bg-muted rounded-lg"><span className="font-medium">Prédictions IA</span><p className="text-muted-foreground text-xs mt-1">Lecture seule</p></div>
              <div className="p-3 bg-muted rounded-lg"><span className="font-medium">Données financières</span><p className="text-muted-foreground text-xs mt-1 text-destructive">Accès refusé</p></div>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Sécurité</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Mot de passe</p>
                <p className="text-xs text-muted-foreground">Dernière modification il y a 45 jours</p>
              </div>
              <Button variant="outline" size="sm">Changer le mot de passe</Button>
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium text-sm">Sessions actives</p>
              </div>
              <div className="space-y-2">
                {sessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
                    <div>
                      <span className="font-medium">{s.device}</span>
                      {s.current && <Badge className="ml-2 bg-primary/10 text-primary text-[10px] border-0">Actuelle</Badge>}
                      <p className="text-xs text-muted-foreground">{s.ip} — {s.date}</p>
                    </div>
                    {!s.current && <Button variant="ghost" size="sm" className="text-destructive text-xs">Révoquer</Button>}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8">Enregistrer les modifications</Button>
        </div>
      </div>
    </div>
  );
}
