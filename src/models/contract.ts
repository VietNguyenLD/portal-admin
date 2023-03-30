export interface Contract {
  addendum_img: string;
  addendum_pdf: string;
  contract_img: string;
  contract_pdf: string;
  terms_img: string;
  terms_pdf: string;
}

export interface DocumentData {
  conditions_img: string;
  conditions_pdf: string;
  contract: Contract;
  registration_form_img: string;
  registration_form_pdf: string;
  service_change_pdf: string;
  service_change_img: string;
}
