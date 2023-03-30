import { DocumentData } from 'models/contract';
import styled from 'styled-components';
import Contract from './Contract';

interface StyledContractListProps {
  col?: number;
}
const StyledContractList = styled.div<StyledContractListProps>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.col || 4}, 1fr);
  gap: 1rem;
`;

interface ContractListProps {
  documentData?: DocumentData;
}

function ContractList(props: ContractListProps) {
  const { documentData } = props;

  const documentDataList = [
    {
      name: 'Phiếu đăng ký',
      data: {
        pdf_source: documentData?.registration_form_pdf,
        img_url: documentData?.registration_form_img,
      },
    },
    {
      name: 'Phụ lục',
      data: {
        pdf_source: documentData?.contract?.addendum_pdf,
        img_url: documentData?.contract?.addendum_img,
      },
    },
    {
      name: 'Điều khoản chung của HĐ',
      data: {
        pdf_source: documentData?.contract?.terms_pdf,
        img_url: documentData?.contract?.terms_img,
      },
    },
    {
      name: 'Hợp đồng',
      data: {
        pdf_source: documentData?.contract?.contract_pdf,
        img_url: documentData?.contract?.contract_img,
      },
    },
    {
      name: 'Điều kiện giao dịch chung',
      data: {
        pdf_source: documentData?.conditions_pdf,
        img_url: documentData?.conditions_img,
      },
    },
    {
      name: 'Phiếu đăng ký thay đổi dịch vụ',
      data: {
        pdf_source: documentData?.service_change_pdf,
        img_url: documentData?.service_change_img,
      },
    },
  ];

  return (
    <StyledContractList>
      {documentDataList?.map((item: any, index: number) => {
        return <Contract key={index} name={item.name} data={item.data} />;
      })}
    </StyledContractList>
  );
}

export default ContractList;
