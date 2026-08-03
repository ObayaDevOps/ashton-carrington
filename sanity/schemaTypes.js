// Import document schemas
import LandingPageSchema from './schemas/landingPageSchema'
import RnDTaxCreditsPageSchema from './schemas/rndTaxCreditsPageSchema'
import CapitalAllowancePageSchema from './schemas/capitalAllowancePageSchema'
import AccountsnFilingPageSchema from './schemas/accountsFilingPageSchema'
import TermsPageSchema from './schemas/termsPageSchema'
import PrivacyPageSchema from './schemas/privacyPolicyPageSchema'
import AboutPageSchema from './schemas/aboutPageSchema'



export const schema = {
  types: [
    LandingPageSchema,
    RnDTaxCreditsPageSchema,
    CapitalAllowancePageSchema,
    AccountsnFilingPageSchema,
    TermsPageSchema,
    PrivacyPageSchema,
    AboutPageSchema
  ],
}
