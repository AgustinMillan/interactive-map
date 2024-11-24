// src/components/infoView.jsx
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import getInfoFromFile from "./getInfoFromFile";
import GraphicView from "./graphicView";
import { calculateDateRange } from "../common/helpers";
import { DateFilterContext } from "../context/dateFilter.context";

const InfoView = ({
  selectedFeatureInfo,
  variableName,
  associatedVariable,
  unit,
  graficType,
}) => {
  const [infoView, setInfoView] = useState(null);
  const [originalInfoData, setOriginalInfoData] = useState(null);
  const [originalAssociatedData, setOriginalAssociatedData] = useState(null);
  const [infoAssociated, setInfoAssociated] = useState(null);
  const [lastElement, setLastElement] = useState("");
  const { setState } = useContext(DateFilterContext);

  const [dateRange, setDateRange] = useState({ min: null, max: null });

  useEffect(() => {
    const fetchInfo = async () => {
      const element = selectedFeatureInfo?.cod_ele;
      if (element !== lastElement || lastElement === "") {
        const info = await getInfoFromFile(variableName, element);
        const associatedData = associatedVariable
          ? await getInfoFromFile(associatedVariable, element)
          : [];

        setInfoView(info);
        setOriginalInfoData(info);
        setInfoAssociated(associatedData);
        setOriginalAssociatedData(associatedData);
        setLastElement(element);

        const newRange = calculateDateRange(info || [], associatedData || []);
        setDateRange(newRange);
      }
    };

    if (selectedFeatureInfo) {
      fetchInfo();
    }

    if (originalInfoData) {
      setState({
        events: originalInfoData || [],
        dateRange,
        setDateRange: handleDateRangeChange,
        setInfoView,
        setInfoAssociated,
        associate: infoAssociated,
      });
    }
  }, [selectedFeatureInfo, variableName, originalInfoData]);
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);

    if (originalInfoData) {
      const filteredInfoData = originalInfoData.filter((item) => {
        const itemDate = dayjs(item.date).valueOf();
        return itemDate >= newRange.min && itemDate <= newRange.max;
      });
      setInfoView(filteredInfoData);
    }

    if (originalAssociatedData) {
      const filteredAssociatedData = originalAssociatedData.filter((item) => {
        const itemDate = dayjs(item.date).valueOf();
        return itemDate >= newRange.min && itemDate <= newRange.max;
      });
      setInfoAssociated(filteredAssociatedData);
    }
  };

  if (!selectedFeatureInfo) {
    return null;
  }

  return (
    <div className="info-sidebar">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            {infoView && (
              <div className="card">
                <div className="card-body">
                  <GraphicView
                    data={infoView}
                    dateRange={dateRange}
                    variableName={variableName}
                    associate={infoAssociated}
                    associatedVariable={associatedVariable}
                    unit={unit}
                    graficType={graficType}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

InfoView.propTypes = {
  selectedFeatureInfo: PropTypes.object,
  variableName: PropTypes.string,
  associatedVariable: PropTypes.any,
  unit: PropTypes.string,
  graficType: PropTypes.string,
};

export default InfoView;
