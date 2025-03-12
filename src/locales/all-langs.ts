// core (MUI)
import { esES as esCore } from '@mui/material/locale';
// date pickers (MUI)
import { esES as esESDate } from '@mui/x-date-pickers/locales';
// data grid (MUI)
import { esES as esESDataGrid } from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  // {
  //   value: 'en',
  //   label: 'English',
  //   countryCode: 'GB',
  //   adapterLocale: 'en',
  //   numberFormat: { code: 'es-GT', currency: 'USD' },
  //   systemValue: {
  //     components: { ...enUSDate.components, ...enUSDataGrid.components },
  //   },
  // },
  // {
  //   value: 'fr',
  //   label: 'French',
  //   countryCode: 'FR',
  //   adapterLocale: 'fr',
  //   numberFormat: { code: 'fr-Fr', currency: 'EUR' },
  //   systemValue: {
  //     components: { ...frFRCore.components, ...frFRDate.components, ...frFRDataGrid.components },
  //   },
  // },
  {
    value: 'es',
    label: 'Español',
    countryCode: 'GT',
    adapterLocale: 'es',
    numberFormat: { code: 'es-GT', currency: 'GTQ' },
    systemValue: {
      components: { ...esCore.components, ...esESDate.components, ...esESDataGrid.components },
    },
  },
  // {
  //   value: 'cn',
  //   label: 'Chinese',
  //   countryCode: 'CN',
  //   adapterLocale: 'zh-cn',
  //   numberFormat: { code: 'zh-CN', currency: 'CNY' },
  //   systemValue: {
  //     components: { ...zhCNCore.components, ...zhCNDate.components, ...zhCNDataGrid.components },
  //   },
  // },
  // {
  //   value: 'ar',
  //   label: 'Arabic',
  //   countryCode: 'SA',
  //   adapterLocale: 'ar-sa',
  //   numberFormat: { code: 'ar', currency: 'AED' },
  //   systemValue: {
  //     components: { ...arSACore.components, ...arSDDataGrid.components },
  //   },
  // },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
