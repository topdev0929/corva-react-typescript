/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import { FC, useState, useEffect } from 'react';
import { capitalize, upperCase } from 'lodash';
import {
  Popover as MuiPopover,
  Typography,
  IconButton,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { DateTimePicker } from '@corva/ui/components';
import moment from 'moment';

import { Chip } from '../Chip';
import { RectIcon } from '../icons/RectIcon';
import { EditIcon } from '../icons/EditIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { CommentIcon } from '../icons/CommentIcon';
import { CommentPopover } from '../CommentPopover';
import { DeleteDialog } from '../DeleteDialog';

import {
  styles,
  getContainer,
  getWrapper,
  getTabWrapper,
  getTab,
  getPositionRelative,
  getSubData,
  getSubDataHeader,
  getSubDateWrapper,
  getPadding,
} from './styles';

import { pvtFuncTypes } from '@/constants/data.const';
import { Status, TPopoverProps, TChip, TSubdata } from '@/types/global.type';
import Comment from '@/components/Comment';

const useStyles = makeStyles({
  root: {
    top: 'calc((100% - 764px) / 2) !important',
    left: 'calc((100% - 1200px) / 2) !important',
  },
  paper: {
    width: '1200px',
    height: '764px',
  },
  popover: {
    backgroundColor: 'transparent',
  },
});

const DATE_FORMAT = 'MM/DD/YYYY';

export const Popover: FC<TPopoverProps> = ({
  title,
  anchorEl,
  setAnchorEl,
  source,
  setSource,
  assetId,
  currentUser,
  ...rest
}) => {
  const data = source[title];
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const [chipIndex, setChipIndex] = useState(0);
  const [commentIndex, setCommentIndex] = useState(-1);
  const [status, setStatus] = useState<Status>(data?.chips?.[0]?.status ?? Status.Done);
  const [subtitle, setSubtitle] = useState<string>(data?.chips?.[0]?.label ?? '');
  const [chips, setChips] = useState<TChip[]>(data?.chips ?? []);
  const [openCloseDate, setOpenCloseDate] = useState<TSubdata>(data?.chips?.[0].subData ?? []);
  const [editStatus, setEditStatus] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [commentStatus, setCommentStatus] = useState(false);
  const [isDelete, setDeleteMode] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setChipIndex(0);
      setStatus(data.chips[0].status);
      setSubtitle(data.chips[0].label);
      setChips(data.chips);
      setOpenCloseDate(data.chips[0].subData);
      setEditStatus(false);
    }
  }, [data]);

  const open = Boolean(anchorEl);
  const id = open ? 'main-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectChip = (status: Status, index: number) => {
    setChipIndex(index);
    setStatus(status);
    setSubtitle(chips[index].label);
    setOpenCloseDate(data.chips[index].subData);
  };

  const setChipStatus = (cStatus: Status) => {
    setStatus(cStatus);
    setOpenDropdown(false);
  };

  const onSave = () => {
    const newChips = [...chips];
    const previousStatus = newChips[chipIndex].status;
    newChips[chipIndex].status = status;
    setChips(newChips);
    setEditStatus(!editStatus);
    setOpenDropdown(false);
    source[title].chips = chips;
    source[title].chips[chipIndex].subData = openCloseDate;

    source[title].chips[chipIndex].comments.push({
      status: Status.Done,
      title: `${upperCase(currentUser.first_name.slice(0, 1))}.${currentUser.last_name}`,
      description: `move from ${previousStatus} to ${status}`,
      time: new Date(),
    });
    setSource({ ...source });
  };

  const onCancel = () => {
    setEditStatus(false);
    setOpenDropdown(false);
    setStatus(data.chips[chipIndex].status);
    setSubtitle(data.chips[chipIndex].label);
    setOpenCloseDate(data.chips[chipIndex].subData);
  };

  const onEditRequest = index => {
    setCommentStatus(true);
    setCommentIndex(index);
  };

  const onDeleteRequest = index => {
    setDeleteMode(true);
    setCommentIndex(index);
  };

  const onDeleteCancel = () => setDeleteMode(false);
  const onDelete = async () => {
    const data = source[title].chips[chipIndex].comments;
    data.splice(commentIndex, 1);
    setSource({ ...source });
    setDeleteMode(false);
    setCommentIndex(-1);
  };

  if (!data) return null;

  return (
    <MuiPopover
      classes={{ root: classes.root, paper: classes.paper }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: 0, left: 0 }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      {...rest}
    >
      <div
        style={{
          ...getContainer(40),
          ...styles.flexCBetween,
        }}
      >
        <div style={getWrapper(8)}>
          <RectIcon color="#272727" stroke="#616161" />
          <Typography style={styles.title}>{title}</Typography>
        </div>
        <IconButton onClick={handleClose} aria-label="close-popover" style={styles.paddingBtn}>
          <CloseIcon />
        </IconButton>
      </div>
      <div
        style={{
          ...getWrapper(8),
          ...styles.chipWrapper,
        }}
      >
        {chips.map((chip, index) => (
          <Chip
            key={`chip-item-${index}`}
            active={chipIndex === index}
            status={chip.status}
            label={chip.label}
            onClick={() => selectChip(chip.status, index)}
          />
        ))}
      </div>
      <div style={styles.divider} />
      <div
        style={{
          ...getContainer(8),
          ...getWrapper(8),
          ...getPositionRelative(),
        }}
      >
        <div style={styles.statusWrapper}>
          <div style={styles.flexCBetween}>
            <Typography style={styles.subTitle}>{subtitle}</Typography>
            <div style={getWrapper(0)}>
              <Typography style={styles.status}>Status</Typography>
              <Chip
                isStatusChip
                status={status}
                label={capitalize(status)}
                editStatus={editStatus}
                onClick={() => editStatus && setOpenDropdown(!openDropdown)}
                disable
              />
            </div>
          </div>
        </div>
        {!editStatus ? (
          <Tooltip title="Edit">
            <IconButton
              aria-label="edit"
              style={{ ...getPadding(0) }}
              onClick={() => setEditStatus(!editStatus)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Tooltip title="Save">
              <IconButton aria-label="edit" style={styles.paddingBtn} onClick={() => onSave()}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              aria-label="close-popover"
              style={styles.paddingBtn}
              onClick={() => onCancel()}
            >
              <CloseIcon />
            </IconButton>
          </>
        )}

        {openDropdown && (
          <div style={styles.statusModal}>
            <Chip
              isStatusChip
              status={Status.Critical}
              label={capitalize(Status.Critical)}
              onClick={() => setChipStatus(Status.Critical)}
            />
            <Chip
              isStatusChip
              status={Status.Medium}
              label={capitalize(Status.Medium)}
              onClick={() => setChipStatus(Status.Medium)}
            />
            <Chip
              isStatusChip
              status={Status.Info}
              label={capitalize(Status.Info)}
              onClick={() => setChipStatus(Status.Info)}
            />
            <Chip
              isStatusChip
              status={Status.Done}
              label={capitalize(Status.Done)}
              onClick={() => setChipStatus(Status.Done)}
            />
          </div>
        )}
      </div>
      <div
        style={{
          ...getContainer(8),
          ...getWrapper(24),
          ...getSubDateWrapper(56.85),
        }}
      >
        {openCloseDate.map((data, index) => (
          <div key={`sub-data-${index}`} style={getSubData()}>
            <Typography style={getSubDataHeader(editStatus)}>{data.header}</Typography>
            {!editStatus ? (
              <Typography style={styles.subContent}>
                {moment(data.content).format(DATE_FORMAT)}
              </Typography>
            ) : (
              <div>
                <DateTimePicker
                  data-testid="date-picker"
                  value={data.content || new Date()}
                  onChange={e => {
                    const date = new Date(moment(e).format(DATE_FORMAT));
                    setOpenCloseDate(
                      openCloseDate.map((item, i) =>
                        i === index ? { header: data.header, content: date } : item
                      )
                    );
                  }}
                  format={DATE_FORMAT}
                  style={styles.paddingPicker}
                />
              </div>
            )}
          </div>
        ))}
        <div style={styles.subData}>
          <Typography style={styles.subHeader}>Responsible Party</Typography>
          <Typography style={styles.subContent}>
            {pvtFuncTypes[chips[chipIndex].pvtIndexes[0]]}
          </Typography>
        </div>
        <div style={styles.subData}>
          <Typography style={styles.subHeader}>Independent Verifier</Typography>
          <Typography style={styles.subContent}>
            {pvtFuncTypes[chips[chipIndex].pvtIndexes[1]]}
          </Typography>
        </div>
      </div>
      <div style={styles.divider} />
      <div
        style={{
          ...getContainer(16),
          ...getWrapper(24),
        }}
      >
        <Typography style={styles.subTitle}>Comments</Typography>
        <div style={getWrapper(16)}>
          {data.commentTabs.map((tab, index) => (
            <div
              key={`comment-tab-${index}`}
              style={getTabWrapper(tabIndex === index)}
              onClick={() => setTabIndex(index)}
            >
              <Typography style={getTab(tabIndex === index)}>{tab}</Typography>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          ...getContainer(16),
          ...styles.subData,
        }}
      >
        {data?.chips?.[chipIndex]?.comments.map((comment, index) => (
          <Comment
            key={`comment-${index}`}
            index={index}
            comment={comment}
            onDelete={onDeleteRequest}
            onEdit={onEditRequest}
          />
        ))}
        {commentStatus && (
          <CommentPopover
            open={commentStatus}
            onClose={() => setCommentStatus(false)}
            commentIndex={commentIndex}
            setCommentIndex={setCommentIndex}
            chipIndex={chipIndex}
            title={title}
            isFilesLoading={isFilesLoading}
            setIsFilesLoading={setIsFilesLoading}
            files={files}
            setFiles={setFiles}
            isEditing={commentIndex !== -1}
            currentUser={currentUser}
            assetId={assetId}
            source={source}
            setSource={setSource}
            comment={
              commentIndex !== -1
                ? chips[chipIndex].comments[commentIndex] || {
                    status: Status.Done,
                    title: '',
                    description: '',
                    time: new Date(),
                  }
                : {
                    status: Status.Done,
                    title: '',
                    description: '',
                    time: new Date(),
                  }
            }
          />
        )}
        {isDelete && (
          <DeleteDialog
            open={isDelete}
            type="comment"
            onCancel={onDeleteCancel}
            onDelete={onDelete}
          />
        )}
        <div style={styles.commentIcon}>
          <IconButton
            aria-label="edit"
            style={{ ...getPadding(5) }}
            onClick={() => setCommentStatus(true)}
          >
            <CommentIcon />
          </IconButton>
        </div>
      </div>
    </MuiPopover>
  );
};
