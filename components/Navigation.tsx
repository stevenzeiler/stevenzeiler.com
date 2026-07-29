'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/utils/i18n/LanguageProvider';
import { dictionaries } from '@/utils/i18n/dictionaries';

export default function Navigation() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const dict = dictionaries[language].navigation;
  const path = pathname ?? '';
  const isHealth = path.startsWith('/health');
  const isFinance = path.startsWith('/finance');

  const links = isHealth
    ? [
        { href: '/health', label: dict.healthHub },
        { href: '/health/weight', label: dict.healthWeight },
        { href: '/health/body-fat', label: dict.healthBodyFat },
        { href: '/health/coach', label: dict.healthCoach },
        { href: '/health/supplements', label: dict.healthSupplements },
      ]
    : isFinance
      ? [
          { href: '/', label: dict.home },
          { href: '/finance/ripple', label: dict.financeRippleLabs },
        ]
      : [
          { href: '/', label: dict.home },
          { href: '/meditation', label: dict.meditation },
          { href: '/yoga/bikram-26', label: dict.yoga },
          { href: '/corporate', label: dict.corporate },
          { href: '/writing', label: dict.writing },
          { href: '/about', label: dict.about },
        ];

  return (
    <nav className="fixed top-4 left-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-forest-900/80 backdrop-blur-sm rounded-full border border-forest-700 overflow-hidden"
      >
        <ul className="flex flex-wrap">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-4 py-2 block transition-colors ${
                  path === link.href
                    ? 'bg-leaf-600 text-earth-50'
                    : 'text-earth-200 hover:bg-forest-800 hover:text-earth-50'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </nav>
  );
} 