import React, { useMemo, useRef, useState } from 'react';
import {
  AddButtonWrapper,
  DownloadListHeader,
  DownloadListItemWrapper,
  DownloadListContainer,
  DownloadListWrapper,
  DownloadListItemUrl,
  DownloadListButtonGroup,
  Spinner,
} from './styles';
import { useStore } from 'devtoolApp/store';
import Button from '../Button';
import { withTheme } from 'styled-components';
import ParserModal from './ParserModal';
import * as downloadListActions from 'devtoolApp/store/downloadList';
import * as uiActions from 'devtoolApp/store/ui';
import LogSection from './LogSection';
import OptionSection from './OptionSection';
import AnalysisStatus from '../AnalysisStatus';
import { FaTrash, FaCheckSquare, FaSquare } from 'react-icons/fa';
import { MdDownloading } from 'react-icons/md';

export const DownloadList = () => {
  const { state, dispatch } = useStore();
  const {
    downloadList,
    downloadLog,
    ui: { tab, log, isSaving, savingIndex, selectedResources = {} },
    staticResource = [],
    networkResource = [],
  } = state;
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = useMemo(() => (event) => {
    if (event) event.stopPropagation();
    setIsModalOpen(false);
  }, []);
  const handleOpen = useMemo(() => (event) => {
    event.stopPropagation();
    setIsModalOpen(true);
  }, []);
  const handleReset = useMemo(
    () => (event) => {
      event.stopPropagation();
      // Reset download list (except main page)
      downloadList.slice(1).forEach((item) => dispatch(downloadListActions.removeDownloadItem(item)));
      // Reset analysis and UI state
      dispatch(uiActions.resetAnalysis());
    },
    [downloadList, dispatch]
  );
  const handleRemove = (item) => (event) => {
    event.stopPropagation();
    dispatch(downloadListActions.removeDownloadItem(item));
  };
  const handleLog = (currentLog) => (event) => {
    event.stopPropagation();
    if (log?.url === currentLog?.url) {
      return dispatch(uiActions.setLog());
    }
    dispatch(uiActions.setLog(currentLog));
  };

  const handleCheckboxChange = (url) => {
    dispatch(uiActions.toggleResourceSelection(url));
  };

  const handleSelectAll = (event) => {
    event.stopPropagation();
    const allUrls = downloadList.reduce((acc, item) => {
      acc[item.url] = true;
      return acc;
    }, {});
    dispatch(uiActions.setSelectedResources(allUrls));
  };

  const handleDeselectAll = (event) => {
    event.stopPropagation();
    dispatch(uiActions.clearSelectedResources());
  };

  const selectedCount = Object.values(selectedResources).filter(Boolean).length;
  const totalCount = downloadList.length;

  const allResources = useMemo(() => [...staticResource, ...networkResource], [staticResource, networkResource]);  return (    <DownloadListWrapper>
      <AnalysisStatus />
      <OptionSection />
      <DownloadListHeader>
        Download List:
        <div style={{ fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#666' }}>
            {selectedCount > 0 ? `${selectedCount} de ${totalCount} seleccionados` : `${totalCount} recursos disponibles`}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              color="secondary" 
              onClick={handleSelectAll}
              style={{ fontSize: '10px', padding: '2px 8px' }}
            >
              <FaCheckSquare style={{ marginRight: '4px' }} />
              Todos
            </Button>
            <Button 
              color="secondary" 
              onClick={handleDeselectAll}
              style={{ fontSize: '10px', padding: '2px 8px' }}
            >
              <FaSquare style={{ marginRight: '4px' }} />
              Ninguno
            </Button>
          </div>
        </div>
      </DownloadListHeader>
      <DownloadListContainer>
        {downloadList.map((item, index) => {
          if (!item) return null; // Protección contra item nulo
          const foundLog = downloadLog.find((i) => i.url === item.url);
          const logExpanded = log && log.url === item.url;
          const isChecked = selectedResources[item.url] || false;
          return (
            <React.Fragment key={item.url}>
              <DownloadListItemWrapper highlighted={tab && item.url === tab.url} done={!!foundLog} logExpanded={logExpanded}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(item.url)}
                  style={{ marginRight: '10px' }}
                />
                <DownloadListItemUrl active={isSaving === item.url}>{item.url}</DownloadListItemUrl>
                <DownloadListButtonGroup>
                  {!isSaving && foundLog && (
                    <Button color={`secondary`} onClick={handleLog(foundLog)}>
                      {logExpanded ? `Hide Log` : `Show Log`}
                    </Button>
                  )}
                  {!isSaving && index !== 0 && (
                    <Button color={`danger`} onClick={handleRemove(item)}>
                      <FaTrash />
                    </Button>
                  )}
                  {isSaving && savingIndex === index && <Spinner />}
                </DownloadListButtonGroup>
              </DownloadListItemWrapper>
            </React.Fragment>
          );
        })}
      </DownloadListContainer>
      <AddButtonWrapper>
        <Button color={`primary`} onClick={handleOpen} disabled={isSaving}>
          + Add URLs
        </Button>
        <Button color={`danger`} onClick={handleReset} disabled={isSaving}>
          Reset
        </Button>
      </AddButtonWrapper>
      <ParserModal isOpen={isModalOpen} onClose={handleClose} />
    </DownloadListWrapper>
  );
};

export default withTheme(DownloadList);
