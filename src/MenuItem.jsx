import React from 'react';
import {joinClasses, classSet, KeyCode} from 'rc-util';

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    ['onKeyDown', 'onMouseLeave', 'onMouseEnter', 'onClick'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }

  componentWillUnmount() {
    const props = this.props;
    if (props.onDestroy) {
      props.onDestroy(props.eventKey);
    }
  }

  onKeyDown(e) {
    const keyCode = e.keyCode;
    if (keyCode === KeyCode.ENTER) {
      this.onClick(e);
      return true;
    }
  }

  onMouseLeave() {
    this.props.parent.leaveTimer = setTimeout(()=> {
      this.props.parent.leaveTimer = null;
      this.props.onItemHover({
        key: this.props.eventKey,
        item: this,
        hover: false,
        trigger: 'mouseleave',
      });
    }, 100);
  }

  onMouseEnter() {
    if (this.props.parent.leaveTimer) {
      clearTimeout(this.props.parent.leaveTimer);
      this.props.parent.leaveTimer = null;
    }
    const props = this.props;
    props.onItemHover({
      key: this.props.eventKey,
      item: this,
      hover: true,
      trigger: 'mouseenter',
    });
  }

  onClick(e) {
    const props = this.props;
    const eventKey = props.eventKey;
    const info = {
      key: eventKey,
      item: this,
      domEvent: e,
    };
    props.onClick(info);
    if (props.multiple) {
      if (props.selected) {
        props.onDeselect(info);
      } else {
        props.onSelect(info);
      }
    } else if (!props.selected) {
      props.onSelect(info);
    }
  }

  getPrefixCls() {
    return this.props.rootPrefixCls + '-item';
  }

  getActiveClassName() {
    return this.getPrefixCls() + '-active';
  }

  getSelectedClassName() {
    return this.getPrefixCls() + '-selected';
  }

  getDisabledClassName() {
    return this.getPrefixCls() + '-disabled';
  }

  render() {
    const props = this.props;
    const classes = {};
    classes[this.getActiveClassName()] = !props.disabled && props.active;
    classes[this.getSelectedClassName()] = props.selected;
    classes[this.getDisabledClassName()] = props.disabled;
    classes[this.getPrefixCls()] = true;
    const attrs = {
      title: props.title,
      className: joinClasses(props.className, classSet(classes)),
      role: 'menuitem',
      'aria-selected': props.selected,
      'aria-disabled': props.disabled,
    };
    let mouseEvent = {};
    if (!props.disabled) {
      mouseEvent = {
        onClick: this.onClick,
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter,
      };
    }
    const style = {};
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level;
    }
    return (
      <li style={style}
        {...attrs}
        {...mouseEvent}>
        {props.children}
      </li>
    );
  }
}

MenuItem.propTypes = {
  rootPrefixCls: React.PropTypes.string,
  eventKey: React.PropTypes.string,
  active: React.PropTypes.bool,
  selected: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  title: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  onClick: React.PropTypes.func,
  onDeselect: React.PropTypes.func,
  parent: React.PropTypes.object,
  onItemHover: React.PropTypes.func,
  onDestroy: React.PropTypes.func,
};

MenuItem.defaultProps = {
  onSelect() {
  },
  onMouseEnter() {
  },
};

export default MenuItem;
