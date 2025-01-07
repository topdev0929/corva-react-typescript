import { render, fireEvent } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { CommentPopover } from '@/components/common/CommentPopover';
import { Status } from '@/types/global.type';

export const mockData = {
  'Influx ID': {
    chips: [
      {
        label: 'Label 1',
        pvtIndexes: [0, 1],
        status: Status.Done,
        subData: [
          { header: 'Header 1', content: new Date() },
          { header: 'Header 2', content: new Date() },
        ],
        comments: [
          {
            status: Status.Critical,
            title: 'Comment Title 1',
            description: 'Comment Description 1',
            time: new Date(),
          },
        ],
      },
    ],
    commentTabs: ['Tab 1', 'Tab 2'],
  },
};

describe('CommentPopover', () => {
  it('renders correctly', () => {
    render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <CommentPopover
          open
          onClose={jest.fn()}
          isEditing={false}
          isFilesLoading={false}
          setIsFilesLoading={jest.fn()}
          files={[]}
          setFiles={jest.fn()}
          commentIndex={-1}
          setCommentIndex={jest.fn()}
          chipIndex={0}
          title="Test"
          currentUser={{ company_id: 1 }}
          assetId={1}
          comment={{ description: '', time: new Date(), title: '', status: Status.Done }}
          source={mockData}
          setSource={jest.fn()}
        />
      </MuiPickersUtilsProvider>
    );
  });

  it('calls onClose when cancel button is clicked', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <CommentPopover
          open
          onClose={onCloseMock}
          isEditing={false}
          isFilesLoading={false}
          setIsFilesLoading={jest.fn()}
          files={[]}
          setFiles={jest.fn()}
          commentIndex={-1}
          setCommentIndex={jest.fn()}
          chipIndex={0}
          title="Test"
          currentUser={{ company_id: 1 }}
          assetId={1}
          comment={{ description: '', time: new Date(), title: '', status: Status.Done }}
          source={{}}
          setSource={jest.fn()}
        />
      </MuiPickersUtilsProvider>
    );
    const cancelButton = getByTestId('comment_modal_cancelBtn');
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls onLocalSave when save button is clicked', async () => {
    const mockCloseFunc = jest.fn();
    const { getByTestId } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <CommentPopover
          open
          onClose={mockCloseFunc}
          isEditing={false}
          isFilesLoading={false}
          setIsFilesLoading={jest.fn()}
          files={[]}
          setFiles={jest.fn()}
          commentIndex={0}
          setCommentIndex={jest.fn()}
          chipIndex={0}
          title="Test"
          currentUser={{ company_id: 1 }}
          assetId={1}
          comment={{ description: '', time: new Date(), title: '', status: Status.Done }}
          source={mockData}
          setSource={jest.fn()}
        />
      </MuiPickersUtilsProvider>
    );
    const saveButton = getByTestId('comment_modal_saveBtn');
    fireEvent.click(saveButton);
  });
});
