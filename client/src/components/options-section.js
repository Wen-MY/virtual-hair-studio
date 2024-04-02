import React from 'react';
import OptionBox from './option-box';

const OptionsSections = ({ categoryIDs,tryOnOptionCategories, tryOnOptions, optionSelected, setOptionSelected,optionProperty, title, subSection, useIcon }) => {

  return (
    <div className='border border-2 rounded-4 p-3 mt-3'>
    <h3 className='border-bottom border-2 mb-3 ms-2 pb-2'>{title?title:tryOnOptionCategories.find(category => category.value === categoryIDs[0])?.label}</h3>
      {categoryIDs.map((categoryID, index)  => (
        <div key={categoryID} className="option-mapping row mx-auto">
          {subSection?<h4>{tryOnOptionCategories.find(category => category.value === categoryID)?.label}</h4>:null}
          {tryOnOptions.map(option => option.category_id == categoryID && (
            <OptionBox
              key={option.id}
              className={optionSelected === option.name ? `btn-primary` : `btn-outline-primary`}
              {...option}
              onClick={() => setOptionSelected(prevState => ({ ...prevState, [optionProperty]: option.name }))}
              icon = {useIcon?option.name:null}
            />
          ))}
          {index === categoryIDs.length - 1 && ( // Check if current categoryID is the last one
            <OptionBox
              key={null}
              className={optionSelected === null ? `btn-secondary` : `btn-outline-secondary`}
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
