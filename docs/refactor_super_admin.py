import os

super_admin_path = r"d:\izone justdial\frontend\src\pages\super-admin\SuperAdmin.tsx"
with open(super_admin_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def get_block(start_line_index, end_line_index):
    return "".join(lines[start_line_index:end_line_index+1])

dummy_data_tab_lines = lines[29:865]
dummy_data_tab_content = "".join(dummy_data_tab_lines)

analytics_tab_lines = lines[866:960]
analytics_tab_content = "".join(analytics_tab_lines)

settings_tab_lines = lines[961:1021]
settings_tab_content = "".join(settings_tab_lines)

admin_dynamic_data_file = r"d:\izone justdial\frontend\src\components\dashboard\admin\AdminDynamicDataTab.tsx"
admin_analytics_file = r"d:\izone justdial\frontend\src\components\dashboard\admin\AdminAnalyticsTab.tsx"
admin_settings_file = r"d:\izone justdial\frontend\src\components\dashboard\admin\AdminSettingsTab.tsx"

os.makedirs(os.path.dirname(admin_dynamic_data_file), exist_ok=True)

# Write AdminDynamicDataTab.tsx
with open(admin_dynamic_data_file, 'w', encoding='utf-8') as f:
    f.write('''import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { authFetch } from '../../../../lib/services/authFetch';
import { Building2, PhoneCall, CheckCircle2, Menu, X, Edit3, MapPin, UserSquare2, Target, AlertCircle } from 'lucide-react';

''')
    f.write(dummy_data_tab_content.replace('DummyDataTab', 'AdminDynamicDataTab'))

# Write AdminAnalyticsTab.tsx
with open(admin_analytics_file, 'w', encoding='utf-8') as f:
    f.write('''import React from 'react';
import { Menu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

''')
    f.write(analytics_tab_content.replace('AnalyticsTab', 'AdminAnalyticsTab'))

# Write AdminSettingsTab.tsx
with open(admin_settings_file, 'w', encoding='utf-8') as f:
    f.write('''import React from 'react';
import { Menu } from 'lucide-react';

''')
    f.write(settings_tab_content.replace('SettingsTab', 'AdminSettingsTab'))

# Rewrite SuperAdmin.tsx without these inline components
new_super_admin_lines = lines[:29] + lines[1022:]
with open(super_admin_path, 'w', encoding='utf-8') as f:
    f.writelines(new_super_admin_lines)
