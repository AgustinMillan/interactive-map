// src/components/infoView.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import getInfoFromFile from "./getInfoFromFile";
import GraphicView from "./graphicView";
import DateFilter from "./dateFilterView";
import { calculateDateRange } from "../common/helpers";


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
  
        const newRange = calculateDateRange(info || [], associatedData || []);
        setDateRange(newRange);
      }
    };
  
    if (selectedFeatureInfo) {
      fetchInfo();
    }
  }, [selectedFeatureInfo, variableName]);
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
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">
                  Información del objeto seleccionado
                </h5>
                <p className="card-text">
                  <strong>Variable:</strong> {variableName?.replace("_", " ")}
                </p>
                <ul className="list-unstyled">
                  {Object.entries(selectedFeatureInfo).map(
                    ([key, value], idx) => (
                      <li key={idx}>
                        <strong>{key}:</strong> {value}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {dateRange.min !== null && dateRange.max !== null && (
                  <DateFilter
                    events={originalInfoData || []}
                    dateRange={dateRange}
                    setDateRange={handleDateRangeChange}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-8">
            {infoView && (
              <div className="card mb-3">
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