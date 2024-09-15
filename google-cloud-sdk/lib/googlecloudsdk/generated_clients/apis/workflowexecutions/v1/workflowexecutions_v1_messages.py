"""Generated message classes for workflowexecutions version v1.

Execute workflows created with Workflows API.
"""
# NOTE: This file is autogenerated and should not be edited by hand.

from __future__ import absolute_import

from apitools.base.protorpclite import messages as _messages
from apitools.base.py import encoding


package = 'workflowexecutions'


class CancelExecutionRequest(_messages.Message):
  r"""Request for the CancelExecution method."""


class Error(_messages.Message):
  r"""Error describes why the execution was abnormally terminated.

  Fields:
    context: Human-readable stack trace string.
    payload: Error message and data returned represented as a JSON string.
    stackTrace: Stack trace with detailed information of where error was
      generated.
  """

  context = _messages.StringField(1)
  payload = _messages.StringField(2)
  stackTrace = _messages.MessageField('StackTrace', 3)


class Execution(_messages.Message):
  r"""A running instance of a
  [Workflow](/workflows/docs/reference/rest/v1/projects.locations.workflows).

  Enums:
    CallLogLevelValueValuesEnum: The call logging level associated to this
      execution.
    StateValueValuesEnum: Output only. Current state of the execution.

  Messages:
    LabelsValue: Labels associated with this execution. Labels can contain at
      most 64 entries. Keys and values can be no longer than 63 characters and
      can only contain lowercase letters, numeric characters, underscores, and
      dashes. Label keys must start with a letter. International characters
      are allowed. By default, labels are inherited from the workflow but are
      overridden by any labels associated with the execution.

  Fields:
    argument: Input parameters of the execution represented as a JSON string.
      The size limit is 32KB. *Note*: If you are using the REST API directly
      to run your workflow, you must escape any JSON string value of
      `argument`. Example:
      `'{"argument":"{\"firstName\":\"FIRST\",\"lastName\":\"LAST\"}"}'`
    callLogLevel: The call logging level associated to this execution.
    duration: Output only. Measures the duration of the execution.
    endTime: Output only. Marks the end of execution, successful or not.
    error: Output only. The error which caused the execution to finish
      prematurely. The value is only present if the execution's state is
      `FAILED` or `CANCELLED`.
    labels: Labels associated with this execution. Labels can contain at most
      64 entries. Keys and values can be no longer than 63 characters and can
      only contain lowercase letters, numeric characters, underscores, and
      dashes. Label keys must start with a letter. International characters
      are allowed. By default, labels are inherited from the workflow but are
      overridden by any labels associated with the execution.
    name: Output only. The resource name of the execution. Format: projects/{p
      roject}/locations/{location}/workflows/{workflow}/executions/{execution}
    result: Output only. Output of the execution represented as a JSON string.
      The value can only be present if the execution's state is `SUCCEEDED`.
    startTime: Output only. Marks the beginning of execution.
    state: Output only. Current state of the execution.
    stateError: Output only. Error regarding the state of the Execution
      resource. For example, this field will have error details if the
      Execution data is unavailable due to revoked KMS key permissions.
    status: Output only. Status tracks the current steps and progress data of
      this execution.
    workflowRevisionId: Output only. Revision of the workflow this execution
      is using.
  """

  class CallLogLevelValueValuesEnum(_messages.Enum):
    r"""The call logging level associated to this execution.

    Values:
      CALL_LOG_LEVEL_UNSPECIFIED: No call logging level specified.
      LOG_ALL_CALLS: Log all call steps within workflows, all call returns,
        and all exceptions raised.
      LOG_ERRORS_ONLY: Log only exceptions that are raised from call steps
        within workflows.
      LOG_NONE: Explicitly log nothing.
    """
    CALL_LOG_LEVEL_UNSPECIFIED = 0
    LOG_ALL_CALLS = 1
    LOG_ERRORS_ONLY = 2
    LOG_NONE = 3

  class StateValueValuesEnum(_messages.Enum):
    r"""Output only. Current state of the execution.

    Values:
      STATE_UNSPECIFIED: Invalid state.
      ACTIVE: The execution is in progress.
      SUCCEEDED: The execution finished successfully.
      FAILED: The execution failed with an error.
      CANCELLED: The execution was stopped intentionally.
      UNAVAILABLE: Execution data is unavailable. See the `state_error` field.
    """
    STATE_UNSPECIFIED = 0
    ACTIVE = 1
    SUCCEEDED = 2
    FAILED = 3
    CANCELLED = 4
    UNAVAILABLE = 5

  @encoding.MapUnrecognizedFields('additionalProperties')
  class LabelsValue(_messages.Message):
    r"""Labels associated with this execution. Labels can contain at most 64
    entries. Keys and values can be no longer than 63 characters and can only
    contain lowercase letters, numeric characters, underscores, and dashes.
    Label keys must start with a letter. International characters are allowed.
    By default, labels are inherited from the workflow but are overridden by
    any labels associated with the execution.

    Messages:
      AdditionalProperty: An additional property for a LabelsValue object.

    Fields:
      additionalProperties: Additional properties of type LabelsValue
    """

    class AdditionalProperty(_messages.Message):
      r"""An additional property for a LabelsValue object.

      Fields:
        key: Name of the additional property.
        value: A string attribute.
      """

      key = _messages.StringField(1)
      value = _messages.StringField(2)

    additionalProperties = _messages.MessageField('AdditionalProperty', 1, repeated=True)

  argument = _messages.StringField(1)
  callLogLevel = _messages.EnumField('CallLogLevelValueValuesEnum', 2)
  duration = _messages.StringField(3)
  endTime = _messages.StringField(4)
  error = _messages.MessageField('Error', 5)
  labels = _messages.MessageField('LabelsValue', 6)
  name = _messages.StringField(7)
  result = _messages.StringField(8)
  startTime = _messages.StringField(9)
  state = _messages.EnumField('StateValueValuesEnum', 10)
  stateError = _messages.MessageField('StateError', 11)
  status = _messages.MessageField('Status', 12)
  workflowRevisionId = _messages.StringField(13)


class ListExecutionsResponse(_messages.Message):
  r"""Response for the ListExecutions method.

  Fields:
    executions: The executions which match the request.
    nextPageToken: A token, which can be sent as `page_token` to retrieve the
      next page. If this field is omitted, there are no subsequent pages.
  """

  executions = _messages.MessageField('Execution', 1, repeated=True)
  nextPageToken = _messages.StringField(2)


class Position(_messages.Message):
  r"""Position contains source position information about the stack trace
  element such as line number, column number and length of the code block in
  bytes.

  Fields:
    column: The source code column position (of the line) the current
      instruction was generated from.
    length: The number of bytes of source code making up this stack trace
      element.
    line: The source code line number the current instruction was generated
      from.
  """

  column = _messages.IntegerField(1)
  length = _messages.IntegerField(2)
  line = _messages.IntegerField(3)


class PubsubMessage(_messages.Message):
  r"""A message that is published by publishers and consumed by subscribers.
  The message must contain either a non-empty data field or at least one
  attribute. Note that client libraries represent this object differently
  depending on the language. See the corresponding [client library
  documentation](https://cloud.google.com/pubsub/docs/reference/libraries) for
  more information. See [quotas and limits]
  (https://cloud.google.com/pubsub/quotas) for more information about message
  limits.

  Messages:
    AttributesValue: Attributes for this message. If this field is empty, the
      message must contain non-empty data. This can be used to filter messages
      on the subscription.

  Fields:
    attributes: Attributes for this message. If this field is empty, the
      message must contain non-empty data. This can be used to filter messages
      on the subscription.
    data: The message data field. If this field is empty, the message must
      contain at least one attribute.
    messageId: ID of this message, assigned by the server when the message is
      published. Guaranteed to be unique within the topic. This value may be
      read by a subscriber that receives a `PubsubMessage` via a `Pull` call
      or a push delivery. It must not be populated by the publisher in a
      `Publish` call.
    orderingKey: If non-empty, identifies related messages for which publish
      order should be respected. If a `Subscription` has
      `enable_message_ordering` set to `true`, messages published with the
      same non-empty `ordering_key` value will be delivered to subscribers in
      the order in which they are received by the Pub/Sub system. All
      `PubsubMessage`s published in a given `PublishRequest` must specify the
      same `ordering_key` value. For more information, see [ordering
      messages](https://cloud.google.com/pubsub/docs/ordering).
    publishTime: The time at which the message was published, populated by the
      server when it receives the `Publish` call. It must not be populated by
      the publisher in a `Publish` call.
  """

  @encoding.MapUnrecognizedFields('additionalProperties')
  class AttributesValue(_messages.Message):
    r"""Attributes for this message. If this field is empty, the message must
    contain non-empty data. This can be used to filter messages on the
    subscription.

    Messages:
      AdditionalProperty: An additional property for a AttributesValue object.

    Fields:
      additionalProperties: Additional properties of type AttributesValue
    """

    class AdditionalProperty(_messages.Message):
      r"""An additional property for a AttributesValue object.

      Fields:
        key: Name of the additional property.
        value: A string attribute.
      """

      key = _messages.StringField(1)
      value = _messages.StringField(2)

    additionalProperties = _messages.MessageField('AdditionalProperty', 1, repeated=True)

  attributes = _messages.MessageField('AttributesValue', 1)
  data = _messages.BytesField(2)
  messageId = _messages.StringField(3)
  orderingKey = _messages.StringField(4)
  publishTime = _messages.StringField(5)


class StackTrace(_messages.Message):
  r"""A collection of stack elements (frames) where an error occurred.

  Fields:
    elements: An array of stack elements.
  """

  elements = _messages.MessageField('StackTraceElement', 1, repeated=True)


class StackTraceElement(_messages.Message):
  r"""A single stack element (frame) where an error occurred.

  Fields:
    position: The source position information of the stack trace element.
    routine: The routine where the error occurred.
    step: The step the error occurred at.
  """

  position = _messages.MessageField('Position', 1)
  routine = _messages.StringField(2)
  step = _messages.StringField(3)


class StandardQueryParameters(_messages.Message):
  r"""Query parameters accepted by all methods.

  Enums:
    FXgafvValueValuesEnum: V1 error format.
    AltValueValuesEnum: Data format for response.

  Fields:
    f__xgafv: V1 error format.
    access_token: OAuth access token.
    alt: Data format for response.
    callback: JSONP
    fields: Selector specifying which fields to include in a partial response.
    key: API key. Your API key identifies your project and provides you with
      API access, quota, and reports. Required unless you provide an OAuth 2.0
      token.
    oauth_token: OAuth 2.0 token for the current user.
    prettyPrint: Returns response with indentations and line breaks.
    quotaUser: Available to use for quota purposes for server-side
      applications. Can be any arbitrary string assigned to a user, but should
      not exceed 40 characters.
    trace: A tracing token of the form "token:<tokenid>" to include in api
      requests.
    uploadType: Legacy upload protocol for media (e.g. "media", "multipart").
    upload_protocol: Upload protocol for media (e.g. "raw", "multipart").
  """

  class AltValueValuesEnum(_messages.Enum):
    r"""Data format for response.

    Values:
      json: Responses with Content-Type of application/json
      media: Media download with context-dependent Content-Type
      proto: Responses with Content-Type of application/x-protobuf
    """
    json = 0
    media = 1
    proto = 2

  class FXgafvValueValuesEnum(_messages.Enum):
    r"""V1 error format.

    Values:
      _1: v1 error format
      _2: v2 error format
    """
    _1 = 0
    _2 = 1

  f__xgafv = _messages.EnumField('FXgafvValueValuesEnum', 1)
  access_token = _messages.StringField(2)
  alt = _messages.EnumField('AltValueValuesEnum', 3, default='json')
  callback = _messages.StringField(4)
  fields = _messages.StringField(5)
  key = _messages.StringField(6)
  oauth_token = _messages.StringField(7)
  prettyPrint = _messages.BooleanField(8, default=True)
  quotaUser = _messages.StringField(9)
  trace = _messages.StringField(10)
  uploadType = _messages.StringField(11)
  upload_protocol = _messages.StringField(12)


class StateError(_messages.Message):
  r"""Describes an error related to the current state of the Execution
  resource.

  Enums:
    TypeValueValuesEnum: The type of this state error.

  Fields:
    details: Provides specifics about the error.
    type: The type of this state error.
  """

  class TypeValueValuesEnum(_messages.Enum):
    r"""The type of this state error.

    Values:
      TYPE_UNSPECIFIED: No type specified.
      KMS_ERROR: Caused by an issue with KMS.
    """
    TYPE_UNSPECIFIED = 0
    KMS_ERROR = 1

  details = _messages.StringField(1)
  type = _messages.EnumField('TypeValueValuesEnum', 2)


class Status(_messages.Message):
  r"""Represents the current status of this execution.

  Fields:
    currentSteps: A list of currently executing or last executed step names
      for the workflow execution currently running. If the workflow has
      succeeded or failed, this is the last attempted or executed step.
      Presently, if the current step is inside a subworkflow, the list only
      includes that step. In the future, the list will contain items for each
      step in the call stack, starting with the outermost step in the `main`
      subworkflow, and ending with the most deeply nested step.
  """

  currentSteps = _messages.MessageField('Step', 1, repeated=True)


class Step(_messages.Message):
  r"""Represents a step of the workflow this execution is running.

  Fields:
    routine: Name of a routine within the workflow.
    step: Name of a step within the routine.
  """

  routine = _messages.StringField(1)
  step = _messages.StringField(2)


class TriggerPubsubExecutionRequest(_messages.Message):
  r"""Request for the TriggerPubsubExecution method.

  Fields:
    GCPCloudEventsMode: Required. LINT: LEGACY_NAMES The query parameter value
      for __GCP_CloudEventsMode, set by the Eventarc service when configuring
      triggers.
    message: Required. The message of the Pub/Sub push notification.
    subscription: Required. The subscription of the Pub/Sub push notification.
      Format: projects/{project}/subscriptions/{sub}
  """

  GCPCloudEventsMode = _messages.StringField(1)
  message = _messages.MessageField('PubsubMessage', 2)
  subscription = _messages.StringField(3)


class WorkflowexecutionsProjectsLocationsWorkflowsExecutionsCancelRequest(_messages.Message):
  r"""A WorkflowexecutionsProjectsLocationsWorkflowsExecutionsCancelRequest
  object.

  Fields:
    cancelExecutionRequest: A CancelExecutionRequest resource to be passed as
      the request body.
    name: Required. Name of the execution to be cancelled. Format: projects/{p
      roject}/locations/{location}/workflows/{workflow}/executions/{execution}
  """

  cancelExecutionRequest = _messages.MessageField('CancelExecutionRequest', 1)
  name = _messages.StringField(2, required=True)


class WorkflowexecutionsProjectsLocationsWorkflowsExecutionsCreateRequest(_messages.Message):
  r"""A WorkflowexecutionsProjectsLocationsWorkflowsExecutionsCreateRequest
  object.

  Fields:
    execution: A Execution resource to be passed as the request body.
    parent: Required. Name of the workflow for which an execution should be
      created. Format:
      projects/{project}/locations/{location}/workflows/{workflow} The latest
      revision of the workflow will be used.
  """

  execution = _messages.MessageField('Execution', 1)
  parent = _messages.StringField(2, required=True)


class WorkflowexecutionsProjectsLocationsWorkflowsExecutionsGetRequest(_messages.Message):
  r"""A WorkflowexecutionsProjectsLocationsWorkflowsExecutionsGetRequest
  object.

  Enums:
    ViewValueValuesEnum: Optional. A view defining which fields should be
      filled in the returned execution. The API will default to the FULL view.

  Fields:
    name: Required. Name of the execution to be retrieved. Format: projects/{p
      roject}/locations/{location}/workflows/{workflow}/executions/{execution}
    view: Optional. A view defining which fields should be filled in the
      returned execution. The API will default to the FULL view.
  """

  class ViewValueValuesEnum(_messages.Enum):
    r"""Optional. A view defining which fields should be filled in the
    returned execution. The API will default to the FULL view.

    Values:
      EXECUTION_VIEW_UNSPECIFIED: The default / unset value.
      BASIC: Includes only basic metadata about the execution. The following
        fields are returned: name, start_time, end_time, duration, state, and
        workflow_revision_id.
      FULL: Includes all data.
    """
    EXECUTION_VIEW_UNSPECIFIED = 0
    BASIC = 1
    FULL = 2

  name = _messages.StringField(1, required=True)
  view = _messages.EnumField('ViewValueValuesEnum', 2)


class WorkflowexecutionsProjectsLocationsWorkflowsExecutionsListRequest(_messages.Message):
  r"""A WorkflowexecutionsProjectsLocationsWorkflowsExecutionsListRequest
  object.

  Enums:
    ViewValueValuesEnum: Optional. A view defining which fields should be
      filled in the returned executions. The API will default to the BASIC
      view.

  Fields:
    filter: Optional. Filters applied to the [Executions.ListExecutions]
      results. The following fields are supported for filtering: executionID,
      state, startTime, endTime, duration, workflowRevisionID, stepName, and
      label.
    orderBy: Optional. The ordering applied to the [Executions.ListExecutions]
      results. By default the ordering is based on descending start time. The
      following fields are supported for order by: executionID, startTime,
      endTime, duration, state, and workflowRevisionID.
    pageSize: Maximum number of executions to return per call. Max supported
      value depends on the selected Execution view: it's 1000 for BASIC and
      100 for FULL. The default value used if the field is not specified is
      100, regardless of the selected view. Values greater than the max value
      will be coerced down to it.
    pageToken: A page token, received from a previous `ListExecutions` call.
      Provide this to retrieve the subsequent page. When paginating, all other
      parameters provided to `ListExecutions` must match the call that
      provided the page token. Note that pagination is applied to dynamic
      data. The list of executions returned can change between page requests.
    parent: Required. Name of the workflow for which the executions should be
      listed. Format:
      projects/{project}/locations/{location}/workflows/{workflow}
    view: Optional. A view defining which fields should be filled in the
      returned executions. The API will default to the BASIC view.
  """

  class ViewValueValuesEnum(_messages.Enum):
    r"""Optional. A view defining which fields should be filled in the
    returned executions. The API will default to the BASIC view.

    Values:
      EXECUTION_VIEW_UNSPECIFIED: The default / unset value.
      BASIC: Includes only basic metadata about the execution. The following
        fields are returned: name, start_time, end_time, duration, state, and
        workflow_revision_id.
      FULL: Includes all data.
    """
    EXECUTION_VIEW_UNSPECIFIED = 0
    BASIC = 1
    FULL = 2

  filter = _messages.StringField(1)
  orderBy = _messages.StringField(2)
  pageSize = _messages.IntegerField(3, variant=_messages.Variant.INT32)
  pageToken = _messages.StringField(4)
  parent = _messages.StringField(5, required=True)
  view = _messages.EnumField('ViewValueValuesEnum', 6)


class WorkflowexecutionsProjectsLocationsWorkflowsTriggerPubsubExecutionRequest(_messages.Message):
  r"""A
  WorkflowexecutionsProjectsLocationsWorkflowsTriggerPubsubExecutionRequest
  object.

  Fields:
    triggerPubsubExecutionRequest: A TriggerPubsubExecutionRequest resource to
      be passed as the request body.
    workflow: Required. Name of the workflow for which an execution should be
      created. Format:
      projects/{project}/locations/{location}/workflows/{workflow}
  """

  triggerPubsubExecutionRequest = _messages.MessageField('TriggerPubsubExecutionRequest', 1)
  workflow = _messages.StringField(2, required=True)


encoding.AddCustomJsonFieldMapping(
    StandardQueryParameters, 'f__xgafv', '$.xgafv')
encoding.AddCustomJsonEnumMapping(
    StandardQueryParameters.FXgafvValueValuesEnum, '_1', '1')
encoding.AddCustomJsonEnumMapping(
    StandardQueryParameters.FXgafvValueValuesEnum, '_2', '2')
