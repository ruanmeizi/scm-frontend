// 币种转换
export function currencyTypeHandle(currency) {
  switch (currency) {
    case '1':
      return '人民币';
      break;
    case '2':
      return '美元';
      break;
    case '3':
      return '欧元';
      break;
    case '4':
      return '英镑';
      break;
    case '5':
      return '日元';
      break;
    case '6':
      return '韩元';
    case '7':
      return '港币';
      break;
    default:
      break;
  }
}

// 审批状态
export function statusTypeHandle(status) {
  switch (status) {
    case 'Draft':
      return '草稿';
      break;
    case 'Approving':
      return '审批中';
      break;
    case 'Approved':
      return '已通过';
      break;
    case 'Rejected':
      return '已驳回';
      break;
    case 'Terminated':
      return '已终止';
      break;
    default:
      break;
  }
}

// 发运方式
export function deliveryTypeHandle(status) {
  switch (status) {
    case '1':
      return '空运';
      break;
    case '5':
      return '海运';
      break;
    default:
      return '';
      break;
  }
}