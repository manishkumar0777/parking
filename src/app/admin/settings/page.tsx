'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, DollarSign, PenTool, Mail, AlertTriangle } from 'lucide-react';

interface SettingsData {
    hourlyRate: number;
    currency: string;
    maintenanceMode: boolean;
    appName: string;
    contactEmail: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingsData>({
        hourlyRate: 10,
        currency: 'USD',
        maintenanceMode: false,
        appName: '',
        contactEmail: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (res.ok && data.settings) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                alert('Settings updated successfully!');
            } else {
                alert('Failed to update settings');
            }
        } catch (error) {
            console.error('Error saving settings', error);
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin"
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">System Settings</h1>
                    <p className="text-muted-foreground">Configure global application parameters</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border bg-muted/30">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <PenTool className="h-5 w-5" />
                            General Information
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Application Name</label>
                                <input
                                    type="text"
                                    name="appName"
                                    value={settings.appName}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={settings.contactEmail}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Settings */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border bg-muted/30">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Pricing Configuration
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hourly Rate</label>
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={settings.hourlyRate}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Currency</label>
                                <select
                                    name="currency"
                                    value={settings.currency}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="INR">INR (₹)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maintenance */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm border-l-4 border-l-yellow-500">
                    <div className="p-6 border-b border-border bg-muted/30">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                            <AlertTriangle className="h-5 w-5" />
                            Danger Zone
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium">Maintenance Mode</label>
                                <p className="text-sm text-muted-foreground">
                                    Disable all new bookings temporarily.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${settings.maintenanceMode ? 'bg-yellow-500' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                <span className="sr-only">Use setting</span>
                                <span
                                    aria-hidden="true"
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/25 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
