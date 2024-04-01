import React from 'react';
import OptionBox from './option-box';

const OptionsSections = ({ categoryIDs,tryOnOptionCategories, tryOnOptions, optionSelected, setOptionSelected,optionProperty, title, subSection }) => {

  return (
    <div>
    <h3 className='border-bottom border-2 mb-3'>{title?title:tryOnOptionCategories.find(category => category.value === categoryIDs[0])?.label}</h3>
      {categoryIDs.map((categoryID, index)  => (
        <div key={categoryID} className="option-mapping row mx-auto">
          {subSection?<h4>{tryOnOptionCategories.find(category => category.value === categoryID)?.label}</h4>:null}
          {tryOnOptions.map(option => option.category_id == categoryID && (
            <OptionBox
              key={option.optionId}
              className={optionSelected === option.name ? `btn-primary` : `btn-outline-primary`}
              {...option}
              onClick={() => setOptionSelected(prevState => ({ ...prevState, [optionProperty]: option.name }))}
            />
          ))}
          {index === categoryIDs.length - 1 && ( // Check if current categoryID is the last one
            <OptionBox
              key={null}
              className={optionSelected === null ? `btn-primary` : `btn-outline-primary`}
              name={'Unchanged'}
              onClick={() => setOptionSelected(prevState => ({ ...prevState, [optionProperty]: null }))}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default OptionsSections;
