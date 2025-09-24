'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n';
import {
  MapPin,
  Phone,
  Clock,
  FacebookIcon,
  InstagramIcon,
  MessageCircleIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  MailIcon,
  StarIcon,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const navLinks = [
    { href: '/', labelKey: 'home', icon: HomeIcon },
    { href: '/gallery', labelKey: 'gallery', icon: ImageIcon },
    { href: '/reviews', labelKey: 'reviews', icon: StarIcon },
    { href: '/about', labelKey: 'about', icon: InfoIcon },
    { href: '/contact', labelKey: 'contact', icon: MailIcon },
  ];

  return (
    <footer className="bg-gray-800 text-white pt-12 sm:pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-400">Hostel 53</h3>
            <p className="text-gray-300 text-sm">{t('footerDescription')}</p>
            <div className="flex space-x-4">
              <Link
                href="https://www.instagram.com/hostell.53?igsh=MXN3ZDg2eTRqb3Nnbw=="
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <InstagramIcon className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FacebookIcon className="h-6 w-6" />
              </Link>
              <Link
                href="https://wa.me/996557530053"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <MessageCircleIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors">
                    {t(link.labelKey as keyof ReturnType<typeof useTranslation>['t'])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('contacts')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-400 mt-1 flex-shrink-0" />
                <span>{t('addressValue')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-400" />
                +996 (557) 53-00-53
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-400" />
                {t('workingHoursValue')}
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('information')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/faq" className="hover:text-primary-400 transition-colors">
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-gray-700" />
        <div className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Хостел 53. {t('allRightsReserved')}.
        </div>
      </div>
    </footer>
  );
}
