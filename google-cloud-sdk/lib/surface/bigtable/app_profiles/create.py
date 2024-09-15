# -*- coding: utf-8 -*- #
# Copyright 2018 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""bigtable app profiles create command."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

import textwrap

from apitools.base.py.exceptions import HttpError
from googlecloudsdk.api_lib.bigtable import app_profiles
from googlecloudsdk.api_lib.bigtable import util
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.bigtable import arguments
from googlecloudsdk.core import log


@base.ReleaseTracks(base.ReleaseTrack.GA, base.ReleaseTrack.BETA)
class CreateAppProfile(base.CreateCommand):
  """Create a new Bigtable app profile."""

  detailed_help = {
      'EXAMPLES': textwrap.dedent("""\
          To create an app profile with a multi-cluster routing policy, run:

            $ {command} my-app-profile-id --instance=my-instance-id --route-any

          To create an app profile with a single-cluster routing policy which
          routes all requests to `my-cluster-id`, run:

            $ {command} my-single-cluster-app-profile --instance=my-instance-id --route-to=my-cluster-id

          To create an app profile with a friendly description, run:

            $ {command} my-app-profile-id --instance=my-instance-id --route-any --description="Routes requests for my use case"

          """),
  }

  @staticmethod
  def Args(parser):
    arguments.AddAppProfileResourceArg(parser, 'to create')
    (
        arguments.ArgAdder(parser)
        .AddDescription('app profile', required=False)
        .AddForce('create')
        .AddAppProfileRouting(is_update=False)
    )

  def _CreateAppProfile(self, app_profile_ref, args):
    """Creates an AppProfile with the given arguments.

    Args:
      app_profile_ref: A resource reference of the new app profile.
      args: an argparse namespace. All the arguments that were provided to this
        command invocation.

    Raises:
      ConflictingArgumentsException:
          If both cluster and multi_cluster are present.
          If both multi_cluster and transactional_writes are present.
          If both cluster and restrict_to are present.
      OneOfArgumentsRequiredException: If neither cluster or multi_cluster are
          present.

    Returns:
      Created app profile resource object.
    """
    return app_profiles.Create(
        app_profile_ref,
        cluster=args.route_to,
        description=args.description,
        multi_cluster=args.route_any,
        restrict_to=args.restrict_to,
        transactional_writes=args.transactional_writes,
        force=args.force,
    )

  def Run(self, args):
    """This is what gets called when the user runs this command.

    Args:
      args: an argparse namespace. All the arguments that were provided to this
        command invocation.

    Raises:
      ConflictingArgumentsException:
          If both cluster and multi_cluster are present.
          If both multi_cluster and transactional_writes are present.
      OneOfArgumentsRequiredException: If neither cluster or multi_cluster are
          present.

    Returns:
      Created resource.
    """
    app_profile_ref = args.CONCEPTS.app_profile.Parse()
    try:
      result = self._CreateAppProfile(app_profile_ref, args)
    except HttpError as e:
      util.FormatErrorMessages(e)
    else:
      log.CreatedResource(app_profile_ref.Name(), kind='app profile')
      return result


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class CreateAppProfileAlpha(CreateAppProfile):
  """Create a new Bigtable app profile."""

  @staticmethod
  def Args(parser):
    arguments.AddAppProfileResourceArg(parser, 'to create')
    (
        arguments.ArgAdder(parser)
        .AddDescription('app profile', required=False)
        .AddForce('create')
        .AddRequestPriority()
        .AddAppProfileRouting(allow_failover_radius=True, is_update=False)
    )

  def _CreateAppProfile(self, app_profile_ref, args):
    """Creates an AppProfile with the given arguments.

    Args:
      app_profile_ref: A resource reference of the new app profile.
      args: an argparse namespace. All the arguments that were provided to this
        command invocation.

    Raises:
      ConflictingArgumentsException:
          If both cluster and multi_cluster are present.
          If both multi_cluster and transactional_writes are present.
          If both cluster and restrict_to are present.
          If both cluster and failover_radius are present.
      OneOfArgumentsRequiredException: If neither cluster or multi_cluster are
          present.

    Returns:
      Created app profile resource object.
    """
    return app_profiles.Create(
        app_profile_ref,
        cluster=args.route_to,
        description=args.description,
        multi_cluster=args.route_any,
        restrict_to=args.restrict_to,
        failover_radius=args.failover_radius,
        transactional_writes=args.transactional_writes,
        force=args.force,
        priority=args.priority,
    )
